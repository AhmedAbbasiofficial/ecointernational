import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/eco-content";

export const Route = createFileRoute("/products/lithium-batteries")({
  head: () => ({
    meta: [
      { title: "Lithium Batteries | ECO International Pakistan — ECOWALL Storage" },
      {
        name: "description",
        content:
          "Explore the complete ECOWALL lithium battery storage catalogue with 6 verified LiFePO4 models from 4kWh to 16kWh.",
      },
      { property: "og:title", content: "Lithium Batteries — ECO International Pakistan" },
      {
        property: "og:description",
        content:
          "Safe, high-cycle LiFePO4 battery energy storage systems engineered for continuous backup power in Pakistan.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LithiumBatteriesPage,
});

function LithiumBatteriesPage() {
  const batteryProducts = products.filter((p) => p.category === "lithium-batteries");

  return (
    <div className="category-page">
      <SiteHeader currentPath="/products/lithium-batteries" />

      <main className="category-main">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb-bar">
          <div className="site-container">
            <nav className="breadcrumb-nav" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={14} />
              <span>Products</span>
              <ChevronRight size={14} />
              <span className="current">Lithium Batteries</span>
            </nav>
          </div>
        </div>

        {/* Category Hero */}
        <section className="category-hero category-banner-hero">
          <div className="site-container">
            <div className="category-hero-inner">
              <div className="category-hero-copy">
                <div className="eyebrow">
                  <span className="red-rule" /> CATEGORY 02
                </div>
                <h1>Lithium Batteries</h1>
                <p>
                  Modular Lithium Iron Phosphate (LiFePO4) energy storage systems engineered with
                  integrated multi-stage Battery Management Systems (BMS) for safe, deep-cycle
                  backup power across Pakistan.
                </p>
                <div className="category-meta-pills">
                  <span className="meta-pill">6 Verified Models</span>
                  <span className="meta-pill">4kWh to 16kWh Capacity</span>
                  <span className="meta-pill">LiFePO4 Chemistry</span>
                  <span className="meta-pill">5-Year Warranty</span>
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

        {/* Products Grid */}
        <section className="category-grid-section">
          <div className="site-container">
            <div className="product-listing-grid">
              {batteryProducts.map((product) => (
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

export default LithiumBatteriesPage;
