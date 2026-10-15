import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Headphones,
  HelpCircle,
  Layers,
  MessageSquare,
  Plus,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ecoContent, featuredProducts, products, type Product } from "@/lib/eco-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ECO International Pakistan | Solar Inverters & Energy Solutions" },
      {
        name: "description",
        content:
          "Explore solar inverters, lithium battery storage, and smart hybrid systems from ECO International Pakistan. Clear product information and direct support.",
      },
      { property: "og:title", content: "ECO International Pakistan — Power Made Practical" },
      {
        property: "og:description",
        content:
          "Practical solar inverter and battery storage technology designed for dependable everyday energy in Pakistan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "preload",
        as: "image",
        type: "image/webp",
        media: "(max-width: 600px)",
        href: ecoContent.heroImageMobileWebp,
      },
      {
        rel: "preload",
        as: "image",
        type: "image/webp",
        media: "(min-width: 601px)",
        href: ecoContent.heroImageWebp,
      },
    ],
  }),
  component: Index,
});

const productFamilies = [
  {
    id: "ecovolt",
    name: "ECO VOLT",
    category: "Solar Inverters",
    description: "High-performance solar inverters for maximum efficiency and reliability.",
    icon: Sun,
    href: "/products/solar-inverters",
  },
  {
    id: "ecocross",
    name: "ECOCROSS",
    category: "Solar Inverters",
    description: "Smart and efficient inverters for modern energy solutions.",
    icon: Activity,
    href: "/products/solar-inverters",
  },
  {
    id: "ecowall",
    name: "ECOWALL",
    category: "Lithium Batteries",
    description: "Reliable and long-lasting lithium batteries for your energy independence.",
    icon: BatteryCharging,
    href: "/products/lithium-batteries",
  },
  {
    id: "ecosmart",
    name: "ECOSMART",
    category: "All in One",
    description: "Integrated inverter and battery systems for complete energy freedom.",
    icon: Layers,
    href: "/products/all-in-one",
  },
];

const guidanceQuestions = [
  {
    id: "bills",
    title: "Lower Daytime Electricity Bills",
    subtitle: "High daytime utility consumption",
    recommendation: "ECO VOLT or ECOCROSS Solar Inverters",
    description:
      "Direct solar-to-load conversion to maximize daytime savings with robust grid synchronization.",
    linkHref: "#featured",
    linkText: "View Inverter Models",
  },
  {
    id: "backup",
    title: "Continuous Night & Outage Backup",
    subtitle: "Frequent power cuts and load shedding",
    recommendation: "ECOWALL Lithium Energy Storage",
    description:
      "High-cycle LiFePO4 battery storage providing instantaneous backup power without noisy generators.",
    linkHref: "#featured",
    linkText: "View Battery Solutions",
  },
  {
    id: "allinone",
    title: "Clean All-in-One Integrated Solution",
    subtitle: "Compact space & modern aesthetics",
    recommendation: "ECOSMART Integrated Hybrid System",
    description:
      "Combines inverter and lithium storage inside a sleek plug-and-play unified enclosure.",
    linkHref: "#featured",
    linkText: "View All-in-One System",
  },
  {
    id: "dealer",
    title: "Dealer, EPC or Installer Requirement",
    subtitle: "Wholesale supply or commercial projects",
    recommendation: "ECOINTL Trade & Distribution Desk",
    description:
      "Direct wholesale pricing, technical datasheets, and dedicated support for solar professionals.",
    linkHref: "/contact-us",
    linkText: "Connect with Trade Desk",
  },
];

const faqItems = [
  {
    question: "What products does ECOINTL offer?",
    answer:
      "ECOINTL offers solar inverter systems (ECO VOLT and ECOCROSS series), lithium battery storage (ECOWALL series), and all-in-one integrated hybrid systems (ECOSMART series).",
    link: { text: "Explore the product families", href: "#product-families" },
  },
  {
    question: "How do I choose the right solar inverter for my home?",
    answer:
      "The right inverter depends on your peak electrical load, connected inductive appliances (air conditioners, pumps), and solar panel capacity. Our team provides honest guidance to help you select the right model.",
    link: { text: "Ask our team for guidance", href: "/contact-us" },
  },
  {
    question: "Can I use lithium batteries with ECO inverters?",
    answer:
      "Yes, ECO inverters are engineered for seamless integration with modern Lithium Iron Phosphate (LiFePO4) storage such as the ECOWALL series, featuring intelligent battery charging profiles.",
    link: { text: "Learn about ECOWALL storage", href: "#product-families" },
  },
  {
    question: "Where can I find verified datasheets and specifications?",
    answer:
      "You can view primary specifications directly on our product cards or request official technical documentation by contacting our technical team.",
    link: { text: "Request technical datasheets", href: "/contact-us" },
  },
  {
    question: "How can dealers and installers partner with ECOINTL?",
    answer:
      "Registered solar dealers, EPC contractors, and distributors can submit an inquiry through our dedicated trade desk to receive wholesale catalogue access and technical assistance.",
    link: { text: "Submit a dealer inquiry", href: "/contact-us" },
  },
];

function Index() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedGuidance, setSelectedGuidance] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isFeaturedInteracting, setIsFeaturedInteracting] = useState(false);
  const [isFeaturedHovered, setIsFeaturedHovered] = useState(false);
  const [carouselMetrics, setCarouselMetrics] = useState({
    viewportWidth: 0,
    slideWidth: 0,
    gap: 0,
  });
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const interactionTimerRef = useRef<number | undefined>(undefined);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const featuredSelection = featuredProducts;
  const maxSlideIndex = Math.max(0, featuredSelection.length - visibleSlides);
  const carouselStep = carouselMetrics.slideWidth + carouselMetrics.gap;

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(motionQuery.matches);
    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);
    return () => motionQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const tabletQuery = window.matchMedia("(max-width: 850px)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateVisibleSlides = () => {
      setVisibleSlides(mobileQuery.matches ? 1 : tabletQuery.matches ? 2 : 3);
    };

    updateVisibleSlides();
    tabletQuery.addEventListener("change", updateVisibleSlides);
    mobileQuery.addEventListener("change", updateVisibleSlides);

    return () => {
      tabletQuery.removeEventListener("change", updateVisibleSlides);
      mobileQuery.removeEventListener("change", updateVisibleSlides);
    };
  }, []);

  useEffect(() => {
    setActiveSlide(0);
  }, [visibleSlides]);

  useEffect(() => {
    const viewport = carouselRef.current;
    const track = viewport?.firstElementChild as HTMLElement | null;
    const firstSlide = track?.firstElementChild as HTMLElement | null;
    if (!viewport || !track || !firstSlide) {
      return undefined;
    }

    const updateCarouselMetrics = () => {
      const trackStyles = window.getComputedStyle(track);
      const nextMetrics = {
        viewportWidth: viewport.clientWidth,
        slideWidth: firstSlide.getBoundingClientRect().width,
        gap: Number.parseFloat(trackStyles.columnGap || trackStyles.gap) || 0,
      };
      setCarouselMetrics((current) =>
        current.viewportWidth === nextMetrics.viewportWidth &&
        current.slideWidth === nextMetrics.slideWidth &&
        current.gap === nextMetrics.gap
          ? current
          : nextMetrics,
      );
    };

    updateCarouselMetrics();
    const resizeObserver = new ResizeObserver(updateCarouselMetrics);
    resizeObserver.observe(viewport);
    resizeObserver.observe(firstSlide);

    return () => resizeObserver.disconnect();
  }, [visibleSlides]);

  useEffect(
    () => () => {
      if (interactionTimerRef.current !== undefined) {
        window.clearTimeout(interactionTimerRef.current);
      }
    },
    [],
  );

  const pauseFeaturedAutoplay = () => {
    setIsFeaturedInteracting(true);
    if (interactionTimerRef.current !== undefined) {
      window.clearTimeout(interactionTimerRef.current);
    }
    interactionTimerRef.current = window.setTimeout(() => {
      setIsFeaturedInteracting(false);
      interactionTimerRef.current = undefined;
    }, 5000);
  };

  const goToSlide = (requestedIndex: number | ((current: number) => number)) => {
    pauseFeaturedAutoplay();
    setActiveSlide((current) => {
      const targetIndex =
        typeof requestedIndex === "function" ? requestedIndex(current) : requestedIndex;
      return Math.max(0, Math.min(targetIndex, maxSlideIndex));
    });
  };

  useEffect(() => {
    if (prefersReducedMotion || isFeaturedInteracting || isFeaturedHovered || maxSlideIndex === 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current >= maxSlideIndex ? 0 : current + 1));
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isFeaturedHovered, isFeaturedInteracting, maxSlideIndex, prefersReducedMotion]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) {
      return;
    }

    const deltaX =
      (event.changedTouches[0]?.clientX ?? touchStartXRef.current) - touchStartXRef.current;
    const startY = touchStartYRef.current;
    const endY = event.changedTouches[0]?.clientY ?? startY;
    const deltaY = startY === null || endY === null ? 0 : endY - startY;
    const isHorizontalSwipe = Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY);
    if (isHorizontalSwipe) {
      goToSlide((current) => current + (deltaX < 0 ? 1 : -1));
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleCarouselKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide((current) => current + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide((current) => current - 1);
    }
  };

  return (
    <div id="home" className="home-page">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* Shared Site Header */}
      <SiteHeader currentPath="/" />

      <main id="main">
        {/* SECTION 1 — Existing Hero Banner */}
        <section
          className="hero-section"
          data-section="02"
          aria-label="ECO International solar inverter range"
        >
          <picture className="hero-banner-picture">
            <source
              type="image/webp"
              media="(max-width: 600px)"
              srcSet={ecoContent.heroImageMobileWebp}
            />
            <source
              type="image/webp"
              media="(min-width: 601px)"
              srcSet={ecoContent.heroImageWebp}
            />
            <source media="(max-width: 600px)" srcSet={ecoContent.heroImageMobile} />
            <img
              className="hero-banner"
              src={ecoContent.heroImage}
              alt="ECO International solar inverter lineup"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          </picture>

          <div className="hero-action-bar">
            <div className="site-container hero-action-inner">
              <div className="hero-intro-text">
                <span className="hero-badge">POWER MADE PRACTICAL</span>
                <p>Engineered for dependable everyday solar performance across Pakistan.</p>
              </div>
              <div className="hero-buttons">
                <Link to="/products" className="primary-button">
                  Explore Products <ArrowUpRight size={17} />
                </Link>
                <Link to="/contact-us" className="secondary-button">
                  Contact ECOINTL <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — Shop by Product Family */}
        <section
          id="product-families"
          className="section product-families-section"
          data-section="03"
        >
          <div className="site-container">
            <div className="family-showcase-header">
              <span className="family-red-accent" />
              <h2>
                Shop by <span className="text-primary">Product Family</span>
              </h2>
              <p>
                Discover our complete range of solar and energy storage solutions, designed for a
                smarter, cleaner and more sustainable tomorrow.
              </p>
            </div>

            <div className="family-showcase-layout">
              {/* Left Column: Large Product Showcase */}
              <div className="family-showcase-banner">
                <img
                  src="/eco-product-family-showcase.jpg"
                  alt="ECOINTL Complete Product Ecosystem — Solar Inverters and Energy Storage"
                  className="showcase-banner-img"
                  loading="lazy"
                />
              </div>

              {/* Right Column: 4 Category Navigation Rows */}
              <div className="family-rows-list">
                {productFamilies.map((family) => {
                  const Icon = family.icon;
                  return (
                    <Link to={family.href} key={family.id} className="family-row-item">
                      <div className="family-row-icon">
                        <Icon size={20} strokeWidth={2} />
                      </div>
                      <div className="family-row-content">
                        <div className="family-row-title-wrap">
                          <h3 className="family-row-name">{family.name}</h3>
                          <span className="family-row-category">{family.category}</span>
                        </div>
                        <p className="family-row-desc">{family.description}</p>
                      </div>
                      <div className="family-row-arrow">
                        <ArrowRight size={18} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Trust & Quality Assurance Bar (from reference design) */}
            <div className="family-trust-bar">
              <div className="trust-bar-item">
                <ShieldCheck size={20} className="trust-icon" />
                <div className="trust-item-text">
                  <strong>Trusted Quality</strong>
                  <span>Reliable &amp; durable products</span>
                </div>
              </div>
              <div className="trust-bar-divider" />
              <div className="trust-bar-item">
                <Sparkles size={20} className="trust-icon" />
                <div className="trust-item-text">
                  <strong>Sustainable Energy</strong>
                  <span>A cleaner tomorrow</span>
                </div>
              </div>
              <div className="trust-bar-divider" />
              <div className="trust-bar-item">
                <CheckCircle2 size={20} className="trust-icon" />
                <div className="trust-item-text">
                  <strong>Global Support</strong>
                  <span>Service worldwide</span>
                </div>
              </div>
              <div className="trust-bar-divider" />
              <div className="trust-bar-item">
                <Headphones size={20} className="trust-icon" />
                <div className="trust-item-text">
                  <strong>Expert Assistance</strong>
                  <span>Always here to help</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Featured Products */}
        <section id="featured" className="section featured-section" data-section="04">
          <div className="site-container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">
                  <span className="red-rule" /> POPULAR MODELS
                </div>
                <h2>
                  Featured Products<span className="text-primary">.</span>
                </h2>
              </div>
              <Link to="/contact-us" className="inline-action">
                Enquire about models <ArrowUpRight size={18} />
              </Link>
            </div>

            <div
              ref={carouselRef}
              className="featured-carousel-viewport"
              tabIndex={0}
              role="region"
              aria-label="Featured products carousel"
              onKeyDown={handleCarouselKeyDown}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onPointerEnter={() => setIsFeaturedHovered(true)}
              onPointerLeave={() => setIsFeaturedHovered(false)}
              onFocus={() => setIsFeaturedHovered(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setIsFeaturedHovered(false);
                }
              }}
            >
              <div
                className="featured-carousel-track"
                style={{
                  transform: `translate3d(-${activeSlide * carouselStep}px, 0, 0)`,
                }}
              >
                {featuredSelection.map((product) => (
                  <article className="product-card featured-carousel-slide" key={product.id}>
                    <div className="product-media-wrap">
                      <span className="product-tag">{product.series}</span>
                      <div className="product-card-image-box">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.imageAlt || product.name}
                            loading="lazy"
                          />
                        )}
                      </div>
                      <Button asChild variant="inverse" size="icon" className="product-view">
                        <Link
                          to="/products/$slug"
                          params={{ slug: product.slug }}
                          aria-label={`View ${product.name}`}
                        >
                          <Plus />
                        </Link>
                      </Button>
                    </div>

                    <div className="product-info">
                      <span className="small-label">{product.series}</span>
                      <h3>{product.name}</h3>
                      {product.power && <p className="mono font-semibold">{product.power}</p>}
                      <div className="product-spec-list">
                        {product.specifications.slice(0, 2).map((spec) => (
                          <p key={spec} className="spec-line">
                            <CheckCircle2 size={13} className="text-primary" />
                            <span>{spec}</span>
                          </p>
                        ))}
                      </div>
                      <div className="product-bottom">
                        <Button variant="link" asChild>
                          <Link to="/products/$slug" params={{ slug: product.slug }}>
                            View Details <ArrowUpRight />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/contact-us">Enquire</Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="featured-carousel-arrow featured-carousel-arrow-prev"
                onClick={() => goToSlide((current) => current - 1)}
                disabled={activeSlide <= 0}
                aria-label="Previous featured products"
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="featured-carousel-arrow featured-carousel-arrow-next"
                onClick={() => goToSlide((current) => current + 1)}
                disabled={activeSlide >= maxSlideIndex}
                aria-label="Next featured products"
              >
                <ChevronRight />
              </Button>
            </div>

            <div className="featured-carousel-controls">
              <div
                className="featured-carousel-pagination"
                aria-label="Featured product carousel pagination"
              >
                {featuredSelection.slice(0, maxSlideIndex + 1).map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    className={`featured-carousel-dot ${index === activeSlide ? "active" : ""}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Show featured product ${index + 1}: ${product.name}`}
                    aria-pressed={index === activeSlide}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Help Me Choose (Product Discovery Assistant) */}
        <section id="help-me-choose" className="section help-choose-section" data-section="05">
          <div className="site-container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">
                  <span className="red-rule" /> PRODUCT DISCOVERY
                </div>
                <h2>
                  Help Me Choose<span className="text-primary">.</span>
                </h2>
              </div>
              <p>
                Select your primary energy goal to discover the right solar product configuration.
              </p>
            </div>

            <div className="guidance-interactive-layout">
              {/* Question / Selection buttons */}
              <div className="guidance-options">
                {guidanceQuestions.map((q, index) => (
                  <button
                    key={q.id}
                    type="button"
                    className={`guidance-option-btn ${selectedGuidance === index ? "active" : ""}`}
                    onClick={() => setSelectedGuidance(index)}
                  >
                    <div className="guidance-option-content">
                      <strong>{q.title}</strong>
                      <span>{q.subtitle}</span>
                    </div>
                    <ChevronRight size={18} />
                  </button>
                ))}
              </div>

              {/* Dynamic Recommendation Card */}
              <div className="guidance-result-panel">
                <div className="result-badge">
                  <Sparkles size={16} /> RECOMMENDED MATCH
                </div>
                <h3>{guidanceQuestions[selectedGuidance].recommendation}</h3>
                <p>{guidanceQuestions[selectedGuidance].description}</p>
                <div className="result-actions">
                  {guidanceQuestions[selectedGuidance].linkHref.startsWith("/") ? (
                    <Link
                      to={guidanceQuestions[selectedGuidance].linkHref}
                      className="primary-button"
                    >
                      {guidanceQuestions[selectedGuidance].linkText} <ArrowUpRight size={16} />
                    </Link>
                  ) : (
                    <a
                      href={guidanceQuestions[selectedGuidance].linkHref}
                      className="primary-button"
                    >
                      {guidanceQuestions[selectedGuidance].linkText} <ArrowUpRight size={16} />
                    </a>
                  )}
                  <Link to="/contact-us" className="secondary-button">
                    Ask for Sizing Guidance <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — Why ECOINTL? (Visual Brand Benefits) */}
        <section className="section why-eco-section" data-section="06">
          <div className="site-container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">
                  <span className="red-rule" /> WHY ECOINTL
                </div>
                <h2>
                  Built Around Practical Value<span className="text-primary">.</span>
                </h2>
              </div>
              <p>Transparent engineering, dependable hardware, and honest guidance.</p>
            </div>

            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <FileText size={24} />
                </div>
                <h3>Clear Product Information</h3>
                <p>
                  Verified technical specifications, transparent datasheets, and honest capability
                  ratings.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <ShieldCheck size={24} />
                </div>
                <h3>Engineered for Durability</h3>
                <p>
                  Hardware designed to withstand challenging local grid fluctuations, voltage
                  spikes, and heavy runtimes.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <HelpCircle size={24} />
                </div>
                <h3>Practical Selection Guidance</h3>
                <p>
                  Uncomplicated advice to help you choose the right inverter capacity and battery
                  chemistry.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <Headphones size={24} />
                </div>
                <h3>Direct &amp; Responsive Support</h3>
                <p>
                  Accessible assistance for homeowners, solar installers, and commercial trade
                  partners across Pakistan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — Short About ECOINTL Introduction (Compact per Priority 2) */}
        <section id="about" className="section about-summary-section" data-section="07">
          <div className="site-container about-summary-layout">
            <div className="about-summary-copy">
              <div className="eyebrow">
                <span className="red-rule" /> ABOUT ECOINTL
              </div>
              <h2>Solar Technology Engineered for Everyday Independence.</h2>
              <p>
                ECO International brings practical, dependable solar inverters and energy solutions
                to homes and businesses across Pakistan. Our focus is straightforward: durable
                hardware, transparent specifications, and responsive guidance so you can make
                informed energy choices.
              </p>
              <div className="about-summary-cta">
                <Link to="/about-us" className="inline-action font-semibold text-lg">
                  Learn More About ECOINTL <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>

            <div className="about-summary-media">
              <img src="/eco-inverter-illustration.svg" alt="ECO Solar Technology" loading="lazy" />
            </div>
          </div>
        </section>

        {/* SECTION 7 — Trust, Resources & FAQ */}
        <section id="support" className="section resources-faq-section" data-section="08">
          <div className="site-container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">
                  <span className="red-rule" /> QUESTIONS &amp; RESOURCES
                </div>
                <h2>
                  Frequently Asked Questions<span className="text-primary">.</span>
                </h2>
              </div>
              <p>
                Find clear answers about ECOINTL inverters, battery storage, and technical
                compatibility.
              </p>
            </div>

            <Accordion type="single" collapsible className="faq-accordion">
              {faqItems.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`} className="faq-item">
                  <AccordionTrigger className="faq-trigger">
                    <span>{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="faq-content">
                    <p>
                      {item.answer}
                      {item.link && (
                        <>
                          {" "}
                          <a href={item.link.href} className="text-primary font-semibold underline">
                            {item.link.text}
                          </a>
                          .
                        </>
                      )}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* SECTION 8 — Dealer and Trade Buyer CTA */}
        <section className="section trade-banner-section" data-section="09">
          <div className="site-container">
            <div className="trade-banner-box">
              <div className="trade-copy">
                <div className="eyebrow text-white">
                  <span className="red-rule" /> TRADE &amp; COMMERCIAL
                </div>
                <h2>Are you a Solar Installer or Trade Dealer?</h2>
                <p>
                  Partner with ECOINTL for reliable volume supply, wholesale catalogue access, and
                  dedicated technical assistance across Pakistan.
                </p>
              </div>
              <div className="trade-action">
                <Button variant="brand" size="lg" asChild>
                  <Link to="/contact-us">
                    Dealer Inquiry <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9 — Final CTA */}
        <section className="section final-cta-section" data-section="10">
          <div className="site-container final-cta-layout">
            <div className="final-cta-content">
              <div className="eyebrow">
                <span className="red-rule" /> READY FOR RELIABLE POWER
              </div>
              <h2>Let’s Find Your Solar Solution.</h2>
              <p>
                Connect with our team today for clear product advice, model specifications, or
                quotation details.
              </p>
            </div>
            <div className="final-cta-buttons">
              <Button variant="brand" size="lg" asChild>
                <Link to="/contact-us">
                  Contact ECOINTL <ArrowUpRight />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#product-families">
                  Explore Products <ArrowUpRight />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Shared Site Footer */}
      <SiteFooter />

      {/* Product Details Modal Dialog */}
      <Dialog
        open={Boolean(selectedProduct)}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
        }}
      >
        <DialogContent className="product-dialog">
          <DialogTitle>{selectedProduct?.name || "Product Details"}</DialogTitle>
          <div className="dialog-body-content">
            {selectedProduct?.image && (
              <div className="dialog-product-img">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="max-h-56 mx-auto object-contain"
                />
              </div>
            )}
            <DialogDescription className="mt-3">
              <strong>{selectedProduct?.series}</strong> — {selectedProduct?.power}
            </DialogDescription>
            <ul className="mt-3 space-y-1 text-sm text-foreground/80">
              {selectedProduct?.specifications.map((spec) => (
                <li key={spec} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
              <Button variant="brand" asChild onClick={() => setSelectedProduct(null)}>
                <Link to="/contact-us">
                  Inquire About This Model <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Index;
