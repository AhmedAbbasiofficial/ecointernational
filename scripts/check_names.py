import json

with open('.tmp-product-data.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    brand = p['brand']
    model = p['model']
    phase_suffix = ""
    if brand == "ECOCROSS":
        if "SP" in p['sizeRating'] or "Single" in p.get('phase', ''):
            phase_suffix = "-SP"
        elif "TP" in p['sizeRating'] or "Three" in p.get('phase', ''):
            phase_suffix = "-TP"
    
    # Naming convention: ECOINTL-[BRAND]-[MODEL]-Datasheet.pdf, disambiguating phase if identical model
    filename = f"ECOINTL-{brand}-{model}{phase_suffix}-Datasheet.pdf"
    print(f"{p['slug']} -> {filename}")
