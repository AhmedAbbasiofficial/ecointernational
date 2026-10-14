"""Generate two-page ECOINTL product specification sheets for every catalogue
product that does not already have a verified, model-specific PDF.

Design language (original ECOINTL, structured after the reviewed reference
datasheet's page organisation — hero + highlights on page 1, grouped
specification tables on page 2):

  * Brand palette: white #FFFFFF, signal red #D71920, graphite #252525,
    light gray #EEEEEE.
  * Page 1 hero: shared solar-energy background (bannersolarinverter.jpeg),
    approved ECOINTL master logo, correct per-family product cutout in the
    foreground, red/graphite model panel.
  * Only verified catalogue data (eco-content.ts) is used — no invented
    specifications, warranties, certifications or claims.
  * Existing verified PDFs (products with datasheetUrl already set) are
    skipped and never overwritten.

Output: public/product-datasheets/ECOINTL-<FAMILY>-<MODEL>-Datasheet.pdf
"""

import html
import json
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.platypus import (
    Image as RLImage,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfgen import canvas as pdfcanvas

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "product-datasheets"
PRODUCTS_PATH = ROOT / ".tmp-product-data.json"
ASSETS = ROOT / "public"
TMP = Path(tempfile.gettempdir())

RED = colors.HexColor("#D71920")
INK = colors.HexColor("#252525")
MUTED = colors.HexColor("#6B6B6B")
RULE = colors.HexColor("#E4E5E7")
PALE = colors.HexColor("#EEEEEE")
WHITE = colors.white
PAGE_W, PAGE_H = A4

# One consistent brand-approved solar-energy background for the whole set.
HERO_BG = ASSETS / "bannersolarinverter.jpeg"
LOGO = ASSETS / "ecointl-logo-complete.png"

# ECOSMART catalogue records map to a family photo whose unit is badged
# ECOCROSS; the ECOSMART-designated asset is used for those heroes instead.
FAMILY_OVERRIDES = {"ECOSMART": ASSETS / "clean_ecosmart.png"}

HERO_H = 392
MARGIN = 15 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

STYLES = {
    "eyebrow": ParagraphStyle(
        "Eyebrow", fontName="Helvetica-Bold", fontSize=8.5, leading=11, textColor=RED
    ),
    "body": ParagraphStyle(
        "Body", fontName="Helvetica", fontSize=9.5, leading=14.5, textColor=INK
    ),
    "feature": ParagraphStyle(
        "Feature", fontName="Helvetica", fontSize=8.8, leading=12.5, textColor=INK
    ),
    "table_head": ParagraphStyle(
        "TableHead", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=WHITE
    ),
    "table_key": ParagraphStyle(
        "TableKey", fontName="Helvetica-Bold", fontSize=8.5, leading=11.5, textColor=INK
    ),
    "table_value": ParagraphStyle(
        "TableValue", fontName="Helvetica", fontSize=8.5, leading=11.5, textColor=INK
    ),
    "note": ParagraphStyle(
        "Note", fontName="Helvetica", fontSize=7.5, leading=11, textColor=MUTED
    ),
    "metric_label": ParagraphStyle(
        "MetricLabel", fontName="Helvetica-Bold", fontSize=6.8, leading=9, textColor=MUTED
    ),
    "metric_value": ParagraphStyle(
        "MetricValue", fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=INK
    ),
}

_cutout_cache: dict[str, Image.Image] = {}


def esc(value) -> str:
    return html.escape(str(value or ""))


def paragraph(value, style) -> Paragraph:
    return Paragraph(esc(value).replace("\n", "<br/>"), style)


# Per-asset flood-fill tolerance: light product panels need a tighter key so
# the background removal does not eat into the enclosure.
CUTOUT_THRESH = {ASSETS / "clean_ecosmart.png": 16}


def product_cutout(path: Path) -> Image.Image:
    key = str(path)
    if key in _cutout_cache:
        return _cutout_cache[key]
    thresh = CUTOUT_THRESH.get(path, 36)
    im = Image.open(path).convert("RGB")
    w, h = im.size
    magenta = (255, 0, 255)
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    for seed in seeds:
        try:
            ImageDraw.floodfill(im, seed, magenta, thresh=thresh)
        except Exception:
            pass
    arr = np.array(im)
    bg_mask = np.all(arr == np.array(magenta), axis=-1)
    alpha = np.where(bg_mask, 0, 255).astype(np.uint8)
    alpha_img = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.6))
    rgba = Image.open(path).convert("RGBA")
    rgba.putalpha(alpha_img)
    bbox = alpha_img.point(lambda p: 255 if p > 8 else 0).getbbox()
    cut = rgba.crop(bbox) if bbox else rgba
    _cutout_cache[key] = cut
    return cut


def prepare_hero_assets(product) -> tuple[ImageReader, float, float, ImageReader, float, float]:
    """Return (bg_reader, bg_w, bg_h, product_reader, prod_w, prod_h)."""
    bg = Image.open(HERO_BG).convert("RGB")
    scale = max(PAGE_W / bg.width, HERO_H / bg.height)
    bg = bg.resize((round(bg.width * scale), round(bg.height * scale)), Image.LANCZOS)
    left = (bg.width - round(PAGE_W)) // 2
    top = (bg.height - round(HERO_H)) // 2
    bg = bg.crop((left, top, left + round(PAGE_W), top + round(HERO_H)))
    bg_path = TMP / "ecointl_hero_bg.jpg"
    bg.save(bg_path, quality=90)

    image_field = str(product.get("image", "")).lstrip("/")
    src = FAMILY_OVERRIDES.get(product.get("brand", ""), ASSETS / image_field)
    cut = product_cutout(src)
    max_h, max_w = 268, 250
    ratio = min(max_w / cut.width, max_h / cut.height)
    prod_w, prod_h = cut.width * ratio, cut.height * ratio
    prod_path = TMP / f"ecointl_cut_{product['id']}.png"
    cut.resize((round(prod_w * 2), round(prod_h * 2)), Image.LANCZOS).save(prod_path)

    return (
        ImageReader(str(bg_path)),
        PAGE_W,
        HERO_H,
        ImageReader(str(prod_path)),
        prod_w,
        prod_h,
    )


class HeroBanner:
    """Page-1 hero: solar scene, approved logo, product cutout, model panel."""

    def __init__(self, product):
        self.product = product
        self.width = PAGE_W
        self.height = HERO_H

    def wrap(self, availWidth, availHeight):
        return (self.width, self.height)

    def splitOn(self, *args):
        return []


def draw_hero(canv, product):
    """Draw the page-1 hero directly on the canvas (top of page)."""
    top_y = PAGE_H - HERO_H
    bg, _, _, prod, prod_w, prod_h = prepare_hero_assets(product)
    canv.saveState()
    canv.drawImage(bg, 0, top_y, width=PAGE_W, height=HERO_H, mask="auto")

    # Graphite legibility band over the lower-left of the photo.
    canv.setFillColor(colors.Color(0.145, 0.145, 0.145, alpha=0.55))
    canv.rect(0, top_y, PAGE_W * 0.62, 118, stroke=0, fill=1)
    canv.setFillColor(colors.Color(0.145, 0.145, 0.145, alpha=0.22))
    canv.rect(0, top_y + 118, PAGE_W * 0.62, 26, stroke=0, fill=1)

    # Approved ECOINTL master logo on a white chip (same asset as the website).
    logo_img = Image.open(LOGO).convert("RGBA")
    logo_h = 27
    logo_w = logo_img.width * (logo_h / logo_img.height)
    chip_w, chip_h = logo_w + 24, logo_h + 16
    chip_x, chip_y = MARGIN, PAGE_H - 22 - chip_h
    canv.setFillColor(WHITE)
    canv.roundRect(chip_x, chip_y, chip_w, chip_h, 4, stroke=0, fill=1)
    logo_path = TMP / "ecointl_logo.png"
    if not logo_path.exists():
        logo_img.save(logo_path)
    canv.drawImage(
        ImageReader(str(logo_path)),
        chip_x + 12,
        chip_y + 8,
        width=logo_w,
        height=logo_h,
        mask="auto",
    )

    # Product cutout, bottom-right of the hero scene.
    prod_x = PAGE_W - MARGIN - prod_w - 6
    prod_y = top_y + 8
    canv.drawImage(
        ImageReader(str(TMP / f"ecointl_cut_{product['id']}.png")),
        prod_x,
        prod_y,
        width=prod_w,
        height=prod_h,
        mask="auto",
    )

    # Red accent + model panel over the graphite band.
    panel_x = MARGIN
    panel_bottom = top_y + 18
    canv.setFillColor(RED)
    canv.rect(panel_x, panel_bottom, 4, 96, stroke=0, fill=1)

    text_x = panel_x + 14
    canv.setFillColor(colors.HexColor("#FFD7D9"))
    canv.setFont("Helvetica-Bold", 8)
    canv.drawString(text_x, panel_bottom + 80, f'{product.get("brand", "")} SERIES  /  {product.get("category", "").replace("-", " ").upper()}')

    # Model name (wrapped manually to fit the panel width).
    name = str(product.get("name", ""))
    max_text_w = PAGE_W * 0.52 - 30
    words = name.split()
    lines, current = [], ""
    canv.setFillColor(WHITE)
    size = 21
    for word in words:
        candidate = f"{current} {word}".strip()
        if canv.stringWidth(candidate, "Helvetica-Bold", size) <= max_text_w:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    if len(lines) > 2:
        size = 16
        lines, current = [], ""
        for word in words:
            candidate = f"{current} {word}".strip()
            if canv.stringWidth(candidate, "Helvetica-Bold", size) <= max_text_w:
                current = candidate
            else:
                lines.append(current)
                current = word
        if current:
            lines.append(current)
    canv.setFont("Helvetica-Bold", size)
    line_h = size + 4
    for i, line in enumerate(lines[:3]):
        canv.drawString(text_x, panel_bottom + 54 - i * line_h, line)

    canv.setFillColor(colors.HexColor("#D9D9D9"))
    canv.setFont("Helvetica", 9.5)
    canv.drawString(text_x, panel_bottom + 8, f'MODEL  {product.get("model", "")}')

    canv.setFillColor(WHITE)
    canv.setFont("Helvetica-Bold", 7.5)
    canv.drawRightString(PAGE_W - MARGIN, PAGE_H - 30, "ECOINTL PRODUCT SPECIFICATION SHEET")
    canv.restoreState()


def page_footer(canv, doc):
    canv.saveState()
    canv.setStrokeColor(RULE)
    canv.setLineWidth(0.7)
    canv.line(MARGIN, 14 * mm, PAGE_W - MARGIN, 14 * mm)
    canv.setFillColor(MUTED)
    canv.setFont("Helvetica", 6.8)
    canv.drawString(
        MARGIN,
        9.5 * mm,
        "ECO International Pakistan  |  ECOINTL product specification sheet  |  Confirm specifications before procurement or installation",
    )
    canv.drawRightString(PAGE_W - MARGIN, 9.5 * mm, f"{doc.page:02d}")
    canv.restoreState()


def page2_header(canv, product):
    canv.saveState()
    canv.setFillColor(RED)
    canv.rect(0, PAGE_H - 4 * mm, PAGE_W, 4 * mm, stroke=0, fill=1)
    logo_path = TMP / "ecointl_logo.png"
    canv.drawImage(ImageReader(str(logo_path)), MARGIN, PAGE_H - 24 * mm, width=95, height=25.4, mask="auto")
    canv.setFillColor(RED)
    canv.setFont("Helvetica-Bold", 8)
    canv.drawRightString(PAGE_W - MARGIN, PAGE_H - 18 * mm, "PRODUCT SPECIFICATION SHEET")
    canv.setFillColor(INK)
    canv.setFont("Helvetica-Bold", 15)
    label = truncate(canv, str(product.get("name", "")), "Helvetica-Bold", 15, CONTENT_W - 130)
    canv.drawString(MARGIN, PAGE_H - 33 * mm, label)
    canv.setFillColor(MUTED)
    canv.setFont("Helvetica", 9)
    canv.drawString(
        MARGIN,
        PAGE_H - 39 * mm,
        f'Model {product.get("model", "")}   |   {product.get("series", "")}   |   Rating: {product.get("sizeRating", "")}',
    )
    canv.setStrokeColor(RULE)
    canv.line(MARGIN, PAGE_H - 42 * mm, PAGE_W - MARGIN, PAGE_H - 42 * mm)
    canv.restoreState()


def truncate(canv, text, font, size, max_w):
    if canv.stringWidth(text, font, size) <= max_w:
        return text
    while text and canv.stringWidth(text + "...", font, size) > max_w:
        text = text[:-1]
    return text + "..."


def fact_cards(product) -> Table:
    candidates = [
        ("RATED POWER", product.get("power")),
        ("BATTERY CAPACITY", product.get("capacity")),
        ("SYSTEM VOLTAGE", product.get("voltage")),
        ("MAX. PV INPUT", product.get("pvInput")),
        ("PROTECTION", product.get("ipRating")),
        ("PHASE", product.get("phase")),
    ]
    facts = [(label, value) for label, value in candidates if value][:4]
    if not facts:
        facts = [("MODEL", product.get("model")), ("WARRANTY", product.get("warranty"))]
    cells = [
        Table(
            [
                [paragraph(label, STYLES["metric_label"])],
                [paragraph(value, STYLES["metric_value"])],
            ],
            colWidths=[CONTENT_W / len(facts) - 8],
            style=TableStyle(
                [
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 1),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
                ]
            ),
        )
        for label, value in facts
    ]
    table = Table([cells], colWidths=[CONTENT_W / len(facts)] * len(facts))
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("LINEABOVE", (0, 0), (-1, 0), 2, RED),
                ("BOX", (0, 0), (-1, -1), 0.5, RULE),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, RULE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    return table


def highlights_block(features) -> Table:
    col_w = CONTENT_W / 2 - 6
    rows = []
    row_cells = []
    for feature in features:
        bullet = Table(
            [[paragraph("✓", ParagraphStyle("chk", fontName="Helvetica-Bold", fontSize=9, textColor=RED))]],
            colWidths=[12],
            style=TableStyle(
                [
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ]
            ),
        )
        cell = Table([[bullet, paragraph(feature, STYLES["feature"])]], colWidths=[14, col_w - 14])
        cell.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                    ("TOPPADDING", (0, 0), (-1, -1), 2),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )
        row_cells.append(cell)
        if len(row_cells) == 2:
            rows.append(row_cells)
            row_cells = []
    if row_cells:
        row_cells.append(Table([[""]], colWidths=[col_w]))
        rows.append(row_cells)
    table = Table(rows, colWidths=[CONTENT_W / 2 + 6, CONTENT_W / 2 - 6])
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    return table


SPEC_GROUPS = {
    "solar-inverters": [
        ("INVERTER", ["Model Number", "Brand", "Rated Power", "Nominal DC Voltage", "Phase Topology"]),
        ("SOLAR PV INPUT", ["Max Solar PV Input", "Solar MPPT Input"]),
        ("PROTECTION", ["Ingress Protection"]),
        ("WARRANTY", ["Official Warranty"]),
    ],
    "lithium-batteries": [
        ("BATTERY", ["Model Number", "Brand", "Cell Chemistry", "Nominal Voltage"]),
        ("CAPACITY", ["Energy Capacity", "Rated Capacity"]),
        ("INSTALLATION", ["Installation Style"]),
        ("WARRANTY", ["Official Warranty"]),
    ],
    "all-in-one": [
        ("SYSTEM", ["Model Number", "Brand", "System Architecture", "System DC Voltage"]),
        ("INVERTER", ["Inverter Rated Power", "Inverter Warranty"]),
        ("BATTERY STORAGE", ["Battery Energy Storage", "Battery Warranty"]),
        ("PROTECTION", ["Ingress Protection"]),
    ],
}


def specification_tables(product) -> list:
    specs: dict = product.get("techSpecs", {})
    groups = SPEC_GROUPS.get(product.get("category", ""), [])
    used: set[str] = set()
    blocks = []
    for title, keys in groups:
        rows = [(k, specs[k]) for k in keys if k in specs]
        used.update(k for k in keys if k in specs)
        if rows:
            blocks.append((title, rows))
    leftovers = [(k, v) for k, v in specs.items() if k not in used]
    if leftovers:
        blocks.append(("ADDITIONAL VERIFIED DATA", leftovers))

    flow = []
    for title, rows in blocks:
        data = [
            [paragraph(title, STYLES["table_head"]), ""],
            *[[paragraph(k, STYLES["table_key"]), paragraph(v, STYLES["table_value"])] for k, v in rows],
        ]
        table = Table(data, colWidths=[CONTENT_W * 0.38, CONTENT_W * 0.62], repeatRows=0)
        style = [
            ("SPAN", (0, 0), (-1, 0)),
            ("BACKGROUND", (0, 0), (-1, 0), INK),
            ("BACKGROUND", (0, 1), (0, -1), WHITE),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("GRID", (0, 0), (-1, -1), 0.45, RULE),
            ("LEFTPADDING", (0, 0), (-1, -1), 9),
            ("RIGHTPADDING", (0, 0), (-1, -1), 9),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]
        for i in range(1, len(data)):
            if i % 2 == 0:
                style.append(("BACKGROUND", (0, i), (-1, i), PALE))
        table.setStyle(TableStyle(style))
        flow.extend((table, Spacer(1, 9)))
    return flow


def filename_for(product) -> str:
    family = str(product.get("brand", "")).replace(" ", "")
    model = str(product.get("model", "")).replace(" ", "").replace("/", "-")
    candidate = f"ECOINTL-{family}-{model}-Datasheet.pdf"
    return candidate


def build_pdf(product, out_path: Path) -> None:
    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=15 * mm,
        bottomMargin=19 * mm,
        title=f'ECOINTL {product.get("name", "")} — Product Specification Sheet ({product.get("model", "")})',
        author="ECO International Pakistan",
        subject=f"ECOINTL product specification sheet for model {product.get('model', '')}",
    )

    page1_story = [Spacer(1, HERO_H + 12)]

    intro = [
        paragraph("PRODUCT OVERVIEW", STYLES["eyebrow"]),
        Spacer(1, 5),
        paragraph(product.get("description", ""), STYLES["body"]),
    ]
    intro_box = Table([[intro]], colWidths=[CONTENT_W])
    intro_box.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    page1_story.extend((intro_box, Spacer(1, 12), fact_cards(product), Spacer(1, 14)))
    page1_story.append(paragraph("KEY HIGHLIGHTS", STYLES["eyebrow"]))
    page1_story.append(Spacer(1, 5))
    page1_story.append(highlights_block(product.get("features", [])[:6]))

    page2_story = [Spacer(1, 27 * mm + 8)]
    page2_story.append(paragraph("TECHNICAL SPECIFICATIONS", STYLES["eyebrow"]))
    page2_story.append(Spacer(1, 3))
    page2_story.append(paragraph(str(product.get("model", "")), ParagraphStyle(
        "p2title", fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=INK
    )))
    page2_story.append(Spacer(1, 8))
    page2_story.extend(specification_tables(product))
    page2_story.append(Spacer(1, 4))
    page2_story.append(paragraph("DOCUMENT NOTE", STYLES["eyebrow"]))
    page2_story.append(Spacer(1, 3))
    page2_story.append(
        paragraph(
            "This ECOINTL product specification sheet was prepared by ECO International Pakistan "
            "from verified catalogue information for model "
            f'{product.get("model", "")}. It is not a manufacturer-issued technical certificate. '
            "Confirm final specifications, compatibility and availability with ECOINTL before "
            "procurement or installation.",
            STYLES["note"],
        )
    )

    page1_story.append(PageBreak())
    page1_story.extend(page2_story)

    def on_first(canv, d):
        draw_hero(canv, product)
        page_footer(canv, d)

    def on_later(canv, d):
        page2_header(canv, product)
        page_footer(canv, d)

    doc.build(page1_story, onFirstPage=on_first, onLaterPages=on_later)


def main():
    if not PRODUCTS_PATH.is_file():
        sys.exit(f"Product export not found: {PRODUCTS_PATH} — run scripts/export-products.mjs first.")
    products = json.loads(PRODUCTS_PATH.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    pending = [p for p in products if not p.get("datasheetUrl")]
    skipped = [p["model"] for p in products if p.get("datasheetUrl")]

    # Models shared by phase variants (e.g. EC-10000D-48V SP and TP) get an
    # explicit -SP / -TP suffix on BOTH files so each PDF stays unambiguous.
    model_counts: dict[str, int] = {}
    for product in pending:
        key = filename_for(product)
        model_counts[key] = model_counts.get(key, 0) + 1

    generated = []
    for product in pending:
        name = filename_for(product)
        if model_counts[name] > 1:
            phase = "TP" if "TP" in str(product.get("phase", "")) else "SP"
            name = name.replace("-Datasheet.pdf", f"-{phase}-Datasheet.pdf")
        out = OUT_DIR / name
        build_pdf(product, out)
        generated.append((product["model"], name))

    print(f"Skipped {len(skipped)} products with existing verified PDFs: {', '.join(skipped)}")
    print(f"Generated {len(generated)} new ECOINTL specification sheets:")
    for model, name in generated:
        print(f"  {model:32s} -> {name}")


if __name__ == "__main__":
    main()
