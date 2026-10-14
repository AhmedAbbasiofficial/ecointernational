import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { products, CATEGORIES, type Product } from "@/lib/eco-content";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) {
      throw notFound();
    }
    return { product };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    if (!product) {
      return { meta: [{ title: "Product Not Found | ECO International" }] };
    }
    return {
      meta: [
        { title: `${product.name} (${product.model}) | ECO International Pakistan` },
        {
          name: "description",
          content: `${product.description} Verified specifications: ${product.sizeRating}. Official warranty: ${product.warranty}.`,
        },
        { property: "og:title", content: `${product.name} — ECO International` },
        { property: "og:description", content: product.description },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product } = Route.useLoaderData();

  const categoryMeta = CATEGORIES.find((c) => c.slug === product.category);
  const categoryTitle = categoryMeta?.name || "Products";
  const categoryPath = `/products/${product.category}`;

  // Related products from the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="product-detail-page">
      <SiteHeader currentPath={`/products/${product.category}`} />

      <main className="product-detail-main">
        {/* A. Breadcrumb Navigation */}
        <div className="breadcrumb-bar">
          <div className="site-container">
            <nav className="breadcrumb-nav" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={14} />
              <Link to="/#products">Products</Link>
              <ChevronRight size={14} />
              <Link to={categoryPath}>{categoryTitle}</Link>
              <ChevronRight size={14} />
              <span className="current">{product.model}</span>
            </nav>
          </div>
        </div>

        {/* Product Hero: B. Image Gallery & C. Identity + Key Information */}
        <section className="product-intro-section">
          <div className="site-container product-intro-layout">
            {/* B. Product Image Gallery */}
            <div className="product-gallery-pane">
              <div className="product-main-visual">
                <span className="gallery-badge">{product.series}</span>
                <img
                  src={product.image}
                  alt={product.imageAlt || product.name}
                  className="product-hero-image"
                  loading="eager"
                />
              </div>
              <div className="gallery-caption">
                <p>
                  Authentic studio photography for {product.brand} {product.model}
                </p>
              </div>
            </div>

            {/* C. Product Identity & Main Information */}
            <div className="product-summary-pane">
              <div className="product-meta-header">
                <span className="product-family-tag">{product.series}</span>
                <span className="product-warranty-badge">
                  <ShieldCheck size={14} /> {product.warranty} Warranty
                </span>
              </div>

              <h1 className="product-title">{product.name}</h1>
              <p className="product-model-code">
                Model: <strong>{product.model}</strong>
              </p>

              <div className="product-rating-box">
                <span className="rating-label">Rating / Size:</span>
                <span className="rating-value">{product.sizeRating}</span>
              </div>

              <p className="product-lead-description">{product.description}</p>

              {/* D. Key Specifications Highlights */}
              <div className="quick-specs-grid">
                {product.power && (
                  <div className="quick-spec-card">
                    <span className="spec-label">Power Rating</span>
                    <strong className="spec-val">{product.power}</strong>
                  </div>
                )}
                {product.capacity && (
                  <div className="quick-spec-card">
                    <span className="spec-label">Storage Capacity</span>
                    <strong className="spec-val">{product.capacity}</strong>
                  </div>
                )}
                {product.voltage && (
                  <div className="quick-spec-card">
                    <span className="spec-label">System Voltage</span>
                    <strong className="spec-val">{product.voltage}</strong>
                  </div>
                )}
                {product.pvInput && (
                  <div className="quick-spec-card">
                    <span className="spec-label">Max Solar PV Input</span>
                    <strong className="spec-val">{product.pvInput}</strong>
                  </div>
                )}
                {product.ipRating && (
                  <div className="quick-spec-card">
                    <span className="spec-label">Ingress Protection</span>
                    <strong className="spec-val">{product.ipRating}</strong>
                  </div>
                )}
                {product.phase && (
                  <div className="quick-spec-card">
                    <span className="spec-label">Grid Phase</span>
                    <strong className="spec-val">{product.phase}</strong>
                  </div>
                )}
              </div>

              {/* H. Clear Product Actions */}
              <div className="product-action-box">
                <Button variant="brand" size="lg" className="w-full sm:w-auto" asChild>
                  <Link to="/contact-us">
                    Inquire About This Model <ArrowUpRight />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                  <Link to="/contact-us">Request Dealer Quotation</Link>
                </Button>
              </div>

              {/* G. Single Product Datasheet (PDF) Action — strictly NO user manuals */}
              <div className="product-datasheet-container">
                <div className="datasheet-action-row">
                  <div className="datasheet-info">
                    <FileText size={22} className="text-primary" />
                    <div>
                      <strong>Download Product Datasheet (PDF)</strong>
                      <p>
                        {product.datasheetUrl
                          ? `Source-document specifications for model ${product.model}.`
                          : `The supplied source document has no matching sheet for ${product.model}. Contact ECOINTL to request the correct PDF.`}
                      </p>
                    </div>
                  </div>

                  {product.datasheetUrl ? (
                    <a href={product.datasheetUrl} download className="primary-button small">
                      <Download size={14} /> Download PDF
                    </a>
                  ) : (
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/contact-us">
                        Request PDF <ArrowUpRight size={14} />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* E. Product Description and Features */}
        <section className="product-features-section">
          <div className="site-container">
            <div className="section-subheading">
              <div className="eyebrow">
                <span className="red-rule" /> KEY CAPABILITIES
              </div>
              <h2>Product Features &amp; Engineering</h2>
            </div>

            <div className="features-checklist-grid">
              {product.features.map((feature, i) => (
                <div key={i} className="feature-check-item">
                  <CheckCircle2 size={18} className="text-primary shrink-0 mt-1" />
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* F. Detailed Technical Specifications Table */}
        <section className="product-specs-table-section">
          <div className="site-container">
            <div className="section-subheading">
              <div className="eyebrow">
                <span className="red-rule" /> TECHNICAL SPECIFICATIONS
              </div>
              <h2>Verified Electrical &amp; Mechanical Parameters</h2>
            </div>

            <div className="specs-table-wrapper">
              <table className="specs-data-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Specification Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(product.techSpecs).map(([label, val]) => (
                    <tr key={label}>
                      <td className="param-label">{label}</td>
                      <td className="param-val">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* I. Related Products from the Same Category */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <div className="site-container">
              <div className="section-subheading">
                <div className="eyebrow">
                  <span className="red-rule" /> SIMILAR MODELS
                </div>
                <h2>Explore Related Products in {categoryTitle}</h2>
              </div>

              <div className="related-grid">
                {relatedProducts.map((rel) => (
                  <article key={rel.id} className="related-card">
                    <div className="related-card-art">
                      <Link to={`/products/${rel.slug}`}>
                        <img src={rel.image} alt={rel.name} loading="lazy" />
                      </Link>
                    </div>
                    <div className="related-card-info">
                      <span className="small-label">{rel.brand}</span>
                      <h4>
                        <Link to={`/products/${rel.slug}`} title={rel.name}>
                          {rel.name}
                        </Link>
                      </h4>
                      <p className="mono text-xs text-muted-foreground" title={rel.model}>
                        {rel.model}
                      </p>
                      <Link
                        to={`/products/${rel.slug}`}
                        className="inline-action mt-2"
                        aria-label={`View ${rel.name} (${rel.model})`}
                      >
                        View Details <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Direct Technical Inquiry Reassurance */}
        <section className="product-inquiry-strip">
          <div className="site-container inquiry-strip-inner">
            <div>
              <h3>Have technical questions about {product.model}?</h3>
              <p>
                Our engineering team can advise on wiring schematics, panel sizing, and system
                matching.
              </p>
            </div>
            <Button variant="brand" size="lg" asChild>
              <Link to="/contact-us">
                Ask an Engineer <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default ProductDetailPage;
