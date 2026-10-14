import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2, ChevronRight, Cpu, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/eco-content";

export const Route = createFileRoute("/products/all-in-one")({
  head: () => ({
    meta: [
      { title: "All in One Solar Systems | ECO International Pakistan — ECOSMART Series" },
      {
        name: "description",
        content:
          "Explore the complete collection of 6 ECOSMART All-in-One combined solar inverter and lithium battery storage systems in Pakistan.",
      },
      { property: "og:title", content: "All in One Solar Systems — ECO International Pakistan" },
      {
        property: "og:description",
        content:
          "Unified hybrid solar inverter and lithium storage cabinets with zero transfer lag and indoor/outdoor IP ratings.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AllInOnePage,
});

function AllInOnePage() {
  const allInOneProducts = products.filter((p) => p.category === "all-in-one");

  return (
    <div className="category-page">
      <SiteHeader currentPath="/products/all-in-one" />

      <main className="category-main">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb-bar">
          <div className="site-container">
            <nav className="breadcrumb-nav" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={14} />
              <span>Products</span>
              <ChevronRight size={14} />
              <span className="current">All in One</span>
            </nav>
          </div>
        </div>

        {/* Category Hero */}
        <section className="category-hero category-banner-hero category-banner-hero-all-in-one">
          <div className="site-container">
            <div className="category-hero-inner">
              <div className="category-hero-copy">
                <div className="eyebrow">
                  <span className="red-rule" /> CATEGORY 03
                </div>
                <h1>All in One</h1>
                <p>
                  Sleek, integrated solar power stations that unify hybrid solar inverters and
                  high-rate lithium iron phosphate storage within a single plug-and-play cabinet
                  with zero transfer lag.
                </p>
                <div className="category-meta-pills">
                  <span className="meta-pill">6 Verified Models</span>
                  <span className="meta-pill">5kW to 12kW Inverters</span>
                  <span className="meta-pill">5kWh to 10kWh 1C Storage</span>
                  <span className="meta-pill">IP21 / IP65 / IP66 Ratings</span>
                </div>
              </div>
              <div className="category-hero-visual">
                <img
                  src="/allinonebanner.jpeg"
                  alt="ECO International all-in-one solar and battery system"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="category-grid-section">
          <div className="site-container">
            <div className="product-listing-grid">
              {allInOneProducts.map((product) => (
                <article key={product.id} className="catalog-product-card">
                  <div className="catalog-card-image-box">
                    <span className="catalog-brand-badge">{product.brand}</span>
                    <Link to={`/products/${product.slug}`} className="image-link">
                      <img src={product.image} alt={product.name} loading="lazy" />
                    </Link>
                  </div>

                  <div className="catalog-card-body">
                    <div className="model-row">
                      <span className="catalog-model-tag">{product.model}</span>
                      <span className="catalog-warranty-pill">
                        <ShieldCheck size={13} /> {product.warranty}
                      </span>
                    </div>

                    <h3>
                      <Link to={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>

                    <p className="catalog-size-rating">{product.sizeRating}</p>

                    <ul className="catalog-specs-list">
                      {product.specifications.slice(0, 3).map((spec) => (
                        <li key={spec}>
                          <CheckCircle2 size={13} className="spec-check" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="catalog-card-footer">
                      <Button variant="brand" size="sm" asChild>
                        <Link to={`/products/${product.slug}`}>
                          View Details <ArrowUpRight size={14} />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/contact-us">Inquire</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default AllInOnePage;
