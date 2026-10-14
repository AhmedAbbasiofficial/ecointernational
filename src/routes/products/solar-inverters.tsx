import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, CheckCircle2, ChevronRight, ShieldCheck, Zap } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { products, type Product } from "@/lib/eco-content";

export const Route = createFileRoute("/products/solar-inverters")({
  head: () => ({
    meta: [
      { title: "Solar Inverters | ECO International Pakistan — ECO VOLT & ECOCROSS" },
      {
        name: "description",
        content:
          "Explore the complete ECOINTL solar inverter catalogue featuring 13 verified ECO VOLT and ECOCROSS pure sine wave & hybrid inverters.",
      },
      { property: "og:title", content: "Solar Inverters — ECO International Pakistan" },
      {
        property: "og:description",
        content:
          "Standalone pure sine wave and hybrid solar inverters for residential and commercial solar installations in Pakistan.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SolarInvertersPage,
});

function SolarInvertersPage() {
  const [familyFilter, setFamilyFilter] = useState<"ALL" | "ECOVOLT" | "ECOCROSS">("ALL");

  const categoryProducts = products.filter((p) => p.category === "solar-inverters");
  const filteredProducts = categoryProducts.filter((p) => {
    if (familyFilter === "ALL") return true;
    return p.brand === familyFilter;
  });

  return (
    <div className="category-page">
      <SiteHeader currentPath="/products/solar-inverters" />

      <main className="category-main">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb-bar">
          <div className="site-container">
            <nav className="breadcrumb-nav" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={14} />
              <span>Products</span>
              <ChevronRight size={14} />
              <span className="current">Solar Inverters</span>
            </nav>
          </div>
        </div>

        {/* Category Hero */}
        <section className="category-hero category-banner-hero">
          <div className="site-container">
            <div className="category-hero-inner">
              <div className="category-hero-copy">
                <div className="eyebrow">
                  <span className="red-rule" /> CATEGORY 01
                </div>
                <h1>Solar Inverters</h1>
                <p>
                  High-efficiency standalone and hybrid solar inverters engineered for dependable
                  daily conversion, wide MPPT tracking windows, and challenging grid conditions
                  across Pakistan.
                </p>
                <div className="category-meta-pills">
                  <span className="meta-pill">13 Verified Models</span>
                  <span className="meta-pill">Single &amp; Three Phase</span>
                  <span className="meta-pill">ECO VOLT &amp; ECOCROSS</span>
                </div>
              </div>
              <div className="category-hero-visual">
                <img
                  src="/bannersolarinverter.jpeg"
                  alt="ECO International solar inverter installation"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Product Filter Bar */}
        <section className="category-toolbar-section">
          <div className="site-container category-toolbar">
            <div className="filter-tabs" role="tablist" aria-label="Product Family Filters">
              <button
                type="button"
                className={`filter-tab ${familyFilter === "ALL" ? "active" : ""}`}
                onClick={() => setFamilyFilter("ALL")}
              >
                All Inverters ({categoryProducts.length})
              </button>
              <button
                type="button"
                className={`filter-tab ${familyFilter === "ECOVOLT" ? "active" : ""}`}
                onClick={() => setFamilyFilter("ECOVOLT")}
              >
                ECO VOLT Series (6)
              </button>
              <button
                type="button"
                className={`filter-tab ${familyFilter === "ECOCROSS" ? "active" : ""}`}
                onClick={() => setFamilyFilter("ECOCROSS")}
              >
                ECOCROSS Series (7)
              </button>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="category-grid-section">
          <div className="site-container">
            <div className="product-listing-grid">
              {filteredProducts.map((product) => (
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

export default SolarInvertersPage;
