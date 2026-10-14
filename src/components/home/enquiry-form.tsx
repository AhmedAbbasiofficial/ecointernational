import { useState, type FormEvent } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ecoContent } from "@/lib/eco-content";

export function EnquiryForm({
  interest,
  onInterestChange,
}: {
  interest: string;
  onInterestChange: (value: string) => void;
}) {
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "phone" | "customerType" | "product", string>>
  >({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const nextErrors: Partial<Record<"name" | "phone" | "customerType" | "product", string>> = {};
    if (String(values["name"] ?? "").trim().length < 2) nextErrors.name = "Please enter your name.";
    if (!/^\+?[\d\s()-]{7,20}$/.test(String(values["phone"] ?? "").trim()))
      nextErrors.phone = "Please enter a valid phone number.";
    if (!values["customerType"]) nextErrors.customerType = "Please select a customer type.";
    if (!values["product"]) nextErrors.product = "Please select your product interest.";
    setErrors(nextErrors);
    setNotice("");
    if (Object.keys(nextErrors).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }
    if (!ecoContent.enquiryEndpoint) {
      setStatus("error");
      setNotice(
        "Online enquiries are not available yet. Your enquiry has not been sent. Please contact ECO through our official social pages.",
      );
      return;
    }
    setStatus("loading");
    try {
      const response = await fetch(ecoContent.enquiryEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("success");
      setNotice("Thank you. Your enquiry has been submitted to ECO International.");
      form.reset();
      onInterestChange("");
    } catch {
      setStatus("error");
      setNotice(
        "Your enquiry could not be sent. Please try again or contact ECO through our official social pages.",
      );
    }
  }

  return (
    <form onSubmit={submit} noValidate className="enquiry-form">
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">
            Full name <span>*</span>
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
            Phone number <span>*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Your phone number"
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
          <label htmlFor="customerType">
            I am a <span>*</span>
          </label>
          <select
            id="customerType"
            name="customerType"
            defaultValue=""
            aria-required="true"
            aria-invalid={Boolean(errors.customerType)}
            aria-describedby={errors.customerType ? "customer-error" : undefined}
          >
            <option value="" disabled>
              Select customer type
            </option>
            <option>Individual</option>
            <option>Installer or Dealer</option>
            <option>Business</option>
          </select>
          {errors.customerType && (
            <p id="customer-error" className="field-error">
              {errors.customerType}
            </p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="product">
            Product interest <span>*</span>
          </label>
          <select
            id="product"
            name="product"
            value={interest}
            onChange={(event) => onInterestChange(event.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.product)}
            aria-describedby={errors.product ? "product-error" : undefined}
          >
            <option value="" disabled>
              Select a product
            </option>
            <option value="Solar inverters">Solar inverters</option>
            <option value="Inverter catalogue preview 01">Inverter catalogue preview 01</option>
            <option value="Inverter catalogue preview 02">Inverter catalogue preview 02</option>
            <option value="Inverter catalogue preview 03">Inverter catalogue preview 03</option>
          </select>
          {errors.product && (
            <p id="product-error" className="field-error">
              {errors.product}
            </p>
          )}
        </div>
        <div className="form-field form-wide">
          <label htmlFor="message">
            Your message <span className="optional">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Tell us a little about what you need…"
          />
        </div>
      </div>
      <div className="form-bottom">
        <p>Online enquiry delivery is awaiting setup.</p>
        <Button variant="brand" size="lg" disabled={status === "loading"} type="submit">
          {status === "loading" ? (
            <>
              <LoaderCircle className="animate-spin" /> Sending
            </>
          ) : (
            <>
              Submit Enquiry <ArrowUpRight />
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
  );
}
