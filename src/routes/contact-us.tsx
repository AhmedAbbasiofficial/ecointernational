import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { ecoContent } from "@/lib/eco-content";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us | ECO International Pakistan — Solar Power Systems" },
      {
        name: "description",
        content:
          "Connect with ECO International Pakistan. Contact our team for solar inverter guidance, lithium battery enquiries, and dealer trade partnerships.",
      },
      { property: "og:title", content: "Contact ECO International Pakistan" },
      {
        property: "og:description",
        content:
          "Speak with our team about solar inverters, battery storage, and smart energy solutions for Pakistan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactUsPage,
});

function ContactUsPage() {
  const [inquiryType, setInquiryType] = useState<"individual" | "dealer">("individual");
  const [productInterest, setProductInterest] = useState("Solar inverters");
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "phone" | "email" | "product", string>>
  >({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const nextErrors: Partial<Record<"name" | "phone" | "email" | "product", string>> = {};

    if (String(values.name ?? "").trim().length < 2) {
      nextErrors.name = "Please enter your full name.";
    }
    if (!/^\+?[\d\s()-]{7,20}$/.test(String(values.phone ?? "").trim())) {
      nextErrors.phone = "Please enter a valid contact phone number.";
    }
    if (!values.product) {
      nextErrors.product = "Please select your primary product or inquiry topic.";
    }

    setErrors(nextErrors);
    setNotice("");

    if (Object.keys(nextErrors).length > 0) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }

    // Honest handling per project configuration rules:
    // If no backend endpoint is configured, clearly state delivery status without storing or claiming transmission.
    if (!ecoContent.enquiryEndpoint) {
      setStatus("error");
      setNotice(
        "Online enquiry transmission is awaiting backend configuration. Your details have not been transmitted. Please connect directly through our official social media channels.",
      );
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch(ecoContent.enquiryEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, inquiryType }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("success");
      setNotice("Thank you. Your inquiry has been received by ECO International.");
      form.reset();
    } catch {
      setStatus("error");
      setNotice(
        "Your inquiry could not be delivered at this time. Please contact ECO International via our verified social channels.",
      );
    }
  }

  return (
    <div className="contact-page">
      <SiteHeader currentPath="/contact-us" />

      <main className="contact-main">
        <section className="contact-content-section">
          <div className="site-container contact-layout single-form-layout">
            <div className="contact-form-column" id="contact-form-block">
              <div className="form-container">
                <div className="form-header">
                  <div
                    className="inquiry-toggle-tabs"
                    role="tablist"
                    aria-label="Inquiry Type Selection"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={inquiryType === "individual"}
                      className={`tab-btn ${inquiryType === "individual" ? "tab-active" : ""}`}
                      onClick={() => setInquiryType("individual")}
                    >
                      Individual Buyer
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={inquiryType === "dealer"}
                      className={`tab-btn ${inquiryType === "dealer" ? "tab-active" : ""}`}
                      onClick={() => {
                        setInquiryType("dealer");
                        setProductInterest("Dealer & Trade Distribution");
                      }}
                    >
                      Dealer / Trade Buyer
                    </button>
                  </div>

                  <h2>Send an Inquiry</h2>
                  <p>
                    {inquiryType === "individual"
                      ? "Tell us about your home energy goals and inverter needs."
                      : "Provide your business details for wholesale catalogue and dealership information."}
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} noValidate className="enquiry-form">
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="name">
                        Full Name <span>*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        autoComplete="name"
                        placeholder="Your full name"
                        aria-required="true"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "name-error" : undefined}
                      />
                      {errors.name && (
                        <p id="name-error" className="field-error">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="phone">
                        Phone Number <span>*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="e.g. +92 300 1234567"
                        aria-required="true"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                      />
                      {errors.phone && (
                        <p id="phone-error" className="field-error">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="email">
                        Email Address <span className="optional">(optional)</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="yourname@example.com"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="product">
                        Inquiry Topic / Product <span>*</span>
                      </label>
                      <select
                        id="product"
                        name="product"
                        value={productInterest}
                        onChange={(e) => setProductInterest(e.target.value)}
                        aria-required="true"
                        aria-invalid={Boolean(errors.product)}
                        aria-describedby={errors.product ? "product-error" : undefined}
                      >
                        <option value="Solar inverters">
                          Solar inverters (ECO VOLT / ECOCROSS)
                        </option>
                        <option value="ECOWALL Lithium Batteries">ECOWALL Lithium Batteries</option>
                        <option value="ECOSMART Integrated Systems">
                          ECOSMART All-in-One Systems
                        </option>
                        <option value="Dealer & Trade Distribution">
                          Dealer &amp; Trade Distribution
                        </option>
                        <option value="Technical Specifications & Datasheets">
                          Technical Specifications &amp; Datasheets
                        </option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                      {errors.product && (
                        <p id="product-error" className="field-error">
                          {errors.product}
                        </p>
                      )}
                    </div>

                    <div className="form-field form-wide">
                      <label htmlFor="message">
                        Message / Requirements <span className="optional">(optional)</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder={
                          inquiryType === "individual"
                            ? "Mention your approximate electrical load, solar panel size, or city..."
                            : "Mention your company name, city of operation, and monthly volume..."
                        }
                      />
                    </div>
                  </div>

                  <div className="form-bottom">
                    <p className="form-status-note">Online submission endpoint awaiting setup.</p>
                    <Button variant="brand" size="lg" disabled={status === "loading"} type="submit">
                      {status === "loading" ? (
                        <>
                          <LoaderCircle className="animate-spin" /> Processing…
                        </>
                      ) : (
                        <>
                          Submit Inquiry <ArrowUpRight />
                        </>
                      )}
                    </Button>
                  </div>

                  {notice && (
                    <p
                      role={status === "success" ? "status" : "alert"}
                      className={status === "success" ? "form-notice" : "field-error form-notice"}
                    >
                      {notice}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default ContactUsPage;
