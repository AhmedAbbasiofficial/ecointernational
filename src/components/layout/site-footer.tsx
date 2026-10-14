import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Facebook, Instagram } from "lucide-react";
import { Wordmark } from "./site-header";
import { ecoContent } from "@/lib/eco-content";

export function SiteFooter() {
  return (
    <footer className="footer" data-section="14">
      <div className="site-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Wordmark footer />
            <p>
              Solar technology. Practical choices.
              <br />A greener future for Pakistan.
            </p>
            <div className="footer-social">
              <a
                href={ecoContent.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ECO International on Facebook"
              >
                <Facebook size={15} />
              </a>
              <a
                href={ecoContent.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ECO International on Instagram"
              >
                <Instagram size={15} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Product Categories</h3>
            <Link to="/products/solar-inverters">Solar Inverters</Link>
            <Link to="/products/lithium-batteries">Lithium Batteries</Link>
            <Link to="/products/all-in-one">All in One</Link>
            <Link to="/about-us">About ECO</Link>
          </div>

          <div className="footer-column">
            <h3>Quick links</h3>
            <Link to="/contact-us">Contact Us</Link>
            <Link to="/contact-us">Dealer Enquiries</Link>
            <a href="/#help-me-choose">Help Me Choose</a>
            <a href="#home">Back to top</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 ECO International Pakistan. All rights reserved.</span>
          <a href="#home">
            Back to top <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
