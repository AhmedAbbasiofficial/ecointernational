import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CheckCircle2,
  Facebook,
  Instagram,
  ShieldCheck,
  Users,
  MessageSquare,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { ecoContent } from "@/lib/eco-content";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About ECOINTL | Solar Technology & Energy Solutions Pakistan" },
      {
        name: "description",
        content:
          "Learn about ECOINTL, its four core product families, and our commitment to dependable, practical solar power systems across Pakistan.",
      },
      { property: "og:title", content: "About ECOINTL | Solar Technology & Energy Solutions" },
      {
        property: "og:description",
        content:
          "Explore ECOINTL’s mission, values, product ecosystem and customer-first approach to solar energy in Pakistan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutUsPage,
});

const productFamilies = [
  {
    name: "ECO VOLT",
    tag: "Solar Inverter Family",
    copy: "Practical, high-efficiency solar inverters designed for stable power conversion and everyday household reliability.",
    image: "/ecovolt-family.jpeg",
    href: "/#products",
  },
  {
    name: "ECOCROSS",
    tag: "Solar Inverter Family",
    copy: "High-performance hybrid and commercial inverters delivering flexible grid-export and high-surge capability.",
    image: "/ecocross-family.jpeg",
    href: "/#featured",
  },
  {
    name: "ECOWALL",
    tag: "Lithium Battery Family",
    copy: "Modular LiFePO4 battery storage engineered for high cycle life, built-in BMS safety, and dependable backup continuity.",
    image: "/ecowall-family.jpeg",
    href: "/#products",
  },
  {
    name: "ECOSMART",
    tag: "Integrated Energy Family",
    copy: "Unified all-in-one solar and battery cabinets offering intelligent power management with zero transfer lag.",
    href: "/contact-us",
  },
];

const values = [
  {
    title: "Integrity & Transparency",
    copy: "We present unembellished technical specifications and honest sizing guidance so customers make confident investments.",
  },
  {
    title: "Safety & Reliability",
    copy: "Every inverter and battery topology is grounded in proven electrical protection, thermal stability, and robust components.",
  },
  {
    title: "Lasting Durability",
    copy: "Hardware engineered to withstand demanding grid fluctuations and continuous everyday operating conditions across Pakistan.",
  },
  {
    title: "Smart Technology",
    copy: "Modern MPPT tracking, flexible battery charging, and intelligent load prioritization for optimal energy control.",
  },
  {
    title: "Community Responsibility",
    copy: "Empowering homes and businesses with clean, dependable solar power to foster greater energy self-reliance.",
  },
];

const trustPoints = [
  {
    title: "Verified Product Information",
    copy: "Clear datasheets and verified model ratings rather than ambiguous marketing promises.",
  },
  {
    title: "Dedicated Technical Support",
    copy: "Accessible guidance for installers, trade buyers, and homeowners to ensure proper system matching.",
  },
  {
    title: "Honest Warranty Guidance",
    copy: "Model-specific warranty terms and clear service channels available prior to purchase.",
  },
];

function AboutUsPage() {
  return (
    <div className="about-page">
      <SiteHeader currentPath="/about-us" />

      <main className="about-main">
        {/* Section A: Hero Banner — Brand Introduction */}
        <section className="about-hero">
          <div className="site-container about-hero-inner">
            <div className="about-hero-copy">
              <div className="eyebrow">
                <span className="red-rule" /> ABOUT ECOINTL
              </div>
              <h1>Powering a Smarter Energy Future.</h1>
              <p>
                Practical solar technology designed for a more energy-independent Pakistan. We
                combine reliable power conversion with transparent engineering.
              </p>
              <div className="about-hero-actions">
                <a href="/#products" className="primary-button">
                  Explore Products <ArrowUpRight size={18} />
                </a>
                <Link to="/contact-us" className="secondary-button">
                  Talk to ECOINTL <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
            <div className="about-hero-visual">
              <img
                src="/eco-banner-desktop.png"
                alt="ECOINTL Solar Inverter Lineup"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* Section B: Who We Are — Company Introduction */}
        <section className="about-section about-story">
          <div className="site-container about-split">
            <div>
              <div className="eyebrow">
                <span className="red-rule" /> WHO WE ARE
              </div>
              <h2>Engineered for reliable, everyday power without unnecessary complexity.</h2>
            </div>
            <div>
              <p>
                ECO International is dedicated to delivering durable solar inverters, lithium energy
                storage, and integrated power management systems across Pakistan. We believe that
                clean energy must be practical, accessible, and grounded in solid engineering.
              </p>
              <p>
                From residential installations navigating unpredictable grid supply to commercial
                operations needing dependable backup, we connect buyers and installers with hardware
                built for real-world reliability.
              </p>
            </div>
          </div>
        </section>

        {/* Section C: Our Product Ecosystem — Product Families */}
        <section className="about-section about-products" id="ecosystem">
          <div className="site-container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">
                  <span className="red-rule" /> OUR PRODUCT ECOSYSTEM
                </div>
                <h2>Four distinct product families designed for tailored energy needs.</h2>
              </div>
            </div>
            <div className="product-family-grid">
              {productFamilies.map((family) => (
                <a href={family.href} key={family.name} className="family-card">
                  <div className="family-art">
                    {family.image && <img src={family.image} alt={family.name} loading="lazy" />}
                  </div>
                  <div className="family-copy">
                    <span className="small-label">{family.tag}</span>
                    <h3>{family.name}</h3>
                    <p>{family.copy}</p>
                    <span className="inline-action">
                      Explore Range <ArrowUpRight size={16} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Section D & E: Mission, Vision, and Values */}
        <section className="about-section about-mission">
          <div className="site-container about-mission-grid">
            <div className="mission-panel">
              <div className="eyebrow">
                <span className="red-rule" /> OUR MISSION
              </div>
              <h3>
                To provide reliable solar power conversion and storage solutions that deliver true
                long-term value to Pakistani homes and enterprises.
              </h3>
            </div>
            <div className="mission-panel">
              <div className="eyebrow">
                <span className="red-rule" /> OUR VISION
              </div>
              <h3>
                Accelerate national energy independence through accessible, durable, and
                thoughtfully engineered renewable energy technology.
              </h3>
            </div>
          </div>

          <div className="site-container value-wrap">
            <div className="eyebrow">
              <span className="red-rule" /> GUIDING PRINCIPLES
            </div>
            <div className="value-grid">
              {values.map((value) => (
                <article className="value-card" key={value.title}>
                  <h4>{value.title}</h4>
                  <p>{value.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section F: Trust, Quality, and Customer Confidence */}
        <section className="about-section about-trust">
          <div className="site-container">
            <div className="eye-brow-block">
              <div className="eyebrow">
                <span className="red-rule" /> TRUST, QUALITY &amp; TRANSPARENCY
              </div>
              <h2>Confidence built on verified technical standards and dedicated support.</h2>
            </div>
            <div className="trust-grid">
              {trustPoints.map((point) => (
                <div className="trust-card" key={point.title}>
                  <div className="trust-icon">
                    <ShieldCheck size={22} />
                  </div>
                  <h3>{point.title}</h3>
                  <p>{point.copy}</p>
                </div>
              ))}
            </div>
            <div className="trust-note">
              <p>
                ECOINTL prioritizes transparent product specifications and authentic equipment
                details. For model-specific datasheets and installation manuals, reach out to our
                technical team.
              </p>
            </div>
          </div>
        </section>

        {/* Section G: Customers & Trade Partners */}
        <section className="about-section about-customers">
          <div className="site-container customers-grid">
            <div className="customer-card customer-card-dark">
              <div className="icon-wrap">
                <Users size={24} />
              </div>
              <div className="eyebrow">
                <span className="red-rule" /> INDIVIDUAL BUYERS &amp; HOMEOWNERS
              </div>
              <h3>
                Find the right solar inverter or battery storage system for your household power
                requirements.
              </h3>
              <div className="customer-actions">
                <a href="/#products" className="primary-button small">
                  Explore Products <ArrowUpRight size={16} />
                </a>
                <Link to="/contact-us" className="secondary-button small">
                  Ask for Guidance <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            <div className="customer-card">
              <div className="icon-wrap">
                <MessageSquare size={24} />
              </div>
              <div className="eyebrow">
                <span className="red-rule" /> DEALERS &amp; TRADE PARTNERS
              </div>
              <h3>
                Collaborate with ECOINTL for wholesale volume, dealer distribution, and engineering
                support.
              </h3>
              <div className="customer-actions">
                <Link to="/contact-us" className="primary-button small">
                  Make an Inquiry <ArrowUpRight size={16} />
                </Link>
                <a href="/#featured" className="secondary-button small">
                  View Catalogue <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section H: Final CTA */}
        <section className="about-section about-cta">
          <div className="site-container about-cta-wrap">
            <div>
              <div className="eyebrow">
                <span className="red-rule" /> READY TO GET STARTED?
              </div>
              <h2>Let’s Find Your Solar Solution.</h2>
            </div>
            <div className="cta-links">
              <Link to="/contact-us" className="primary-button">
                Contact ECOINTL <ArrowUpRight size={18} />
              </Link>
              <a href="/#products" className="secondary-button">
                Explore Products <ArrowUpRight size={18} />
              </a>
              <a
                href={ecoContent.facebook}
                target="_blank"
                rel="noreferrer"
                className="social-button"
                aria-label="ECO International Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={ecoContent.instagram}
                target="_blank"
                rel="noreferrer"
                className="social-button"
                aria-label="ECO International Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default AboutUsPage;
