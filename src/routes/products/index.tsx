import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, CheckCircle2, ChevronRight, Search, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, products, type Product } from "@/lib/eco-content";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "All Products | ECO International Pakistan — Solar Power Systems" },
      {
        name: "description",
        content:
          "Browse the complete ECO International catalogue of solar inverters, lithium batteries, and all-in-one systems.",
      },
      { property: "og:title", content: "All Products — ECO International Pakistan" },
      {
        property: "og:description",
        content:
          "Browse our complete range of solar inverters, lithium batteries, and integrated systems.",
      },
    ],
  }),
  component: ProductsIndexPage,
});

function ProductsIndexPage() {
  const [categoryFilter, setCategoryFilter] = useState<"all" | Product["category"]>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = products.filter((product) => {
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const searchableText = `${product.name} ${product.model} ${product.brand} ${product.series}`;
    return (
      matchesCategory && searchableText.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  });

  return (
    <div className="category-page">
      <SiteHeader currentPath="/products" />

      <main className="category-main">
        <div className="breadcrumb-bar">
          <div className="site-container">
            <nav className="breadcrumb-nav" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={14} />
              <span className="current">Products</span>
            </nav>
          </div>
        </div>

        <section className="category-hero">
          <div className="site-container">
            <div className="category-hero-copy max-w-3xl">
              <div className="eyebrow">
                <span className="red-rule" /> OUR CATALOGUE
              </div>
              <h1>All Products</h1>
              <p>
                Browse every ECO VOLT, ECOCROSS, ECOWALL, and ECOSMART model in the ECOINTL
                catalogue.
              </p>
              <div className="category-meta-pills">
                <span className="meta-pill">{products.length} Catalogue Models</span>
                <span className="meta-pill">Solar Inverters</span>
                <span className="meta-pill">Lithium Batteries</span>
                <span className="meta-pill">All in One</span>
              </div>
            </div>
          </div>
        </section>

        <section className="category-toolbar-section">
          <div className="site-container category-toolbar catalogue-toolbar">
            <div className="filter-tabs" role="group" aria-label="Filter products by category">
              <button
                type="button"
                className={`filter-tab${categoryFilter === "all" ? " active" : ""}`}
                onClick={() => setCategoryFilter("all")}
                aria-pressed={categoryFilter === "all"}
              >
                All Products ({products.length})
              </button>
              {CATEGORIES.map((category) => {
                const categorySlug = category.slug as Product["category"];
                const categoryCount = products.filter(
                  (product) => product.category === categorySlug,
                ).length;
                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`filter-tab${categoryFilter === categorySlug ? " active" : ""}`}
                    onClick={() => setCategoryFilter(categorySlug)}
                    aria-pressed={categoryFilter === categorySlug}
                  >
                    {category.name} ({categoryCount})
                  </button>
                );
              })}
            </div>

            <label className="catalogue-search">
              <span className="sr-only">Search products by name, model, or series</span>
              <Search size={16} aria-hidden="true" />
              <Input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search models"
              />
            </label>
          </div>
        </section>

        <section className="category-grid-section">
          <div className="site-container">
            <p className="catalogue-result-count" role="status">
              Showing {filteredProducts.length} of {products.length} models
            </p>
            {filteredProducts.length > 0 ? (
              <div className="product-listing-grid">
                {filteredProducts.map((product) => (
                  <article key={product.id} className="catalog-product-card">
                    <div className="catalog-card-image-box">
                      <span className="catalog-brand-badge">{product.brand}</span>
                      <Link to={`/products/${product.slug}`} className="image-link">
                        <img
                          src={product.image}
                          alt={product.imageAlt || product.name}
                          loading="lazy"
                        />
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
                        {product.specifications.slice(0, 3).map((specification) => (
                          <li key={specification}>
                            <CheckCircle2 size={13} className="spec-check" />
                            <span>{specification}</span>
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
            ) : (
              <p className="catalogue-empty-state">No products match that search.</p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default ProductsIndexPage;
