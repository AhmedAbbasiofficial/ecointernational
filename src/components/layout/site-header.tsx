import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Facebook,
  Instagram,
  Menu,
  SunMedium,
  Battery,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ecoContent, CATEGORIES } from "@/lib/eco-content";

export function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      to="/"
      className={`wordmark ${footer ? "wordmark-footer" : ""}`}
      aria-label="ECO International home"
    >
      <img
        src={footer ? ecoContent.logoImageFooter : ecoContent.logoImage}
        alt="ECO International"
        className="brand-logo"
        width={footer ? 1524 : 1538}
        height={footer ? 394 : 411}
      />
    </Link>
  );
}

interface SiteHeaderProps {
  currentPath?: string;
}

export function SiteHeader({ currentPath = "/" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(true);

  useEffect(() => {
    if (!productsOpen) {
      return undefined;
    }

    const handleDocumentPointerDown = (event: MouseEvent) => {
      const dropdownWrapper = document.querySelector(".nav-dropdown-wrapper");
      if (dropdownWrapper && !dropdownWrapper.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProductsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentPointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentPointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [productsOpen]);

  return (
    <>
      <div className="contact-bar" data-section="00">
        <div className="site-container contact-bar-inner">
          <p className="contact-bar-announcement">{ecoContent.announcement}</p>
          <div className="social-links">
            <a
              href={ecoContent.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ECO International on Facebook"
            >
              <Facebook size={14} />
            </a>
            <a
              href={ecoContent.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ECO International on Instagram"
            >
              <Instagram size={14} />
            </a>
          </div>
        </div>
      </div>

      <header className="main-header" data-section="01">
        <div className="site-container header-inner">
          <Wordmark />

          <nav className="desktop-nav" aria-label="Main navigation">
            <Link to="/" className={`nav-link ${currentPath === "/" ? "nav-active" : ""}`}>
              Home
            </Link>
            <Link
              to="/about-us"
              className={`nav-link ${currentPath === "/about-us" ? "nav-active" : ""}`}
            >
              About Us
            </Link>

            {/* Products Dropdown Menu with EXACT 3 categories */}
            <div
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
              onFocusCapture={() => setProductsOpen(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setProductsOpen(false);
                }
              }}
            >
              <button
                type="button"
                className={`nav-link dropdown-trigger ${currentPath.startsWith("/products") ? "nav-active" : ""}`}
                onClick={() => setProductsOpen((prev) => !prev)}
                aria-expanded={productsOpen}
                aria-haspopup="true"
              >
                Products{" "}
                <ChevronDown
                  size={14}
                  className={`dropdown-chevron ${productsOpen ? "rotated" : ""}`}
                />
              </button>

              {productsOpen && (
                <div className="products-dropdown-menu" role="menu">
                  <Link
                    to="/products/solar-inverters"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => setProductsOpen(false)}
                  >
                    <div className="dropdown-item-icon">
                      <SunMedium size={18} />
                    </div>
                    <div className="dropdown-item-text">
                      <strong>Solar Inverters</strong>
                      <span>ECO VOLT &amp; ECOCROSS (13 Models)</span>
                    </div>
                  </Link>

                  <Link
                    to="/products/lithium-batteries"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => setProductsOpen(false)}
                  >
                    <div className="dropdown-item-icon">
                      <Battery size={18} />
                    </div>
                    <div className="dropdown-item-text">
                      <strong>Lithium Batteries</strong>
                      <span>ECOWALL LiFePO4 (6 Models)</span>
                    </div>
                  </Link>

                  <Link
                    to="/products/all-in-one"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => setProductsOpen(false)}
                  >
                    <div className="dropdown-item-icon">
                      <Cpu size={18} />
                    </div>
                    <div className="dropdown-item-text">
                      <strong>All in One</strong>
                      <span>ECOSMART Integrated (6 Models)</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/contact-us"
              className={`nav-link ${currentPath === "/contact-us" ? "nav-active" : ""}`}
            >
              Contact Us
            </Link>
          </nav>

          <Button variant="brand" className="header-cta" asChild>
            <Link to="/contact-us">
              Enquire Now <ArrowUpRight />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu />
          </Button>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent>
          <SheetTitle>ECO International</SheetTitle>
          <SheetDescription>Solar technology. Made practical.</SheetDescription>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={currentPath === "/" ? "nav-active" : ""}
            >
              Home <ArrowUpRight size={18} />
            </Link>
            <Link
              to="/about-us"
              onClick={() => setMenuOpen(false)}
              className={currentPath === "/about-us" ? "nav-active" : ""}
            >
              About Us <ArrowUpRight size={18} />
            </Link>

            {/* Mobile Categories Group */}
            <div className="mobile-nav-group">
              <button
                type="button"
                className="mobile-group-toggle"
                onClick={() => setMobileProductsOpen((prev) => !prev)}
              >
                <span>Products</span>
                <ChevronDown size={16} className={mobileProductsOpen ? "rotated" : ""} />
              </button>

              {mobileProductsOpen && (
                <div className="mobile-sub-nav">
                  <Link
                    to="/products/solar-inverters"
                    onClick={() => setMenuOpen(false)}
                    className="mobile-sub-link"
                  >
                    <span>1. Solar Inverters</span>
                    <ArrowUpRight size={14} />
                  </Link>
                  <Link
                    to="/products/lithium-batteries"
                    onClick={() => setMenuOpen(false)}
                    className="mobile-sub-link"
                  >
                    <span>2. Lithium Batteries</span>
                    <ArrowUpRight size={14} />
                  </Link>
                  <Link
                    to="/products/all-in-one"
                    onClick={() => setMenuOpen(false)}
                    className="mobile-sub-link"
                  >
                    <span>3. All in One</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/contact-us"
              onClick={() => setMenuOpen(false)}
              className={currentPath === "/contact-us" ? "nav-active" : ""}
            >
              Contact Us <ArrowUpRight size={18} />
            </Link>
          </nav>
          <Button asChild variant="brand">
            <Link to="/contact-us" onClick={() => setMenuOpen(false)}>
              Get in touch <ArrowUpRight />
            </Link>
          </Button>
        </SheetContent>
      </Sheet>
    </>
  );
}
