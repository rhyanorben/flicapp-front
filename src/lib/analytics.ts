/**
 * Analytics tracking utilities for landing page events
 * Compatible with Google Tag Manager dataLayer
 */

interface WindowWithDataLayer extends Window {
  dataLayer?: Array<Record<string, unknown>>;
}

type EventCategory =
  | "cta"
  | "navigation"
  | "engagement"
  | "pricing"
  | "faq"
  | "whatsapp";

type EventAction = "click" | "view" | "scroll" | "toggle" | "expand" | "submit";

interface TrackEventParams {
  action: EventAction;
  category: EventCategory;
  label?: string;
  value?: number;
  section?: string;
}

/**
 * Track a custom event
 */
export function trackEvent({
  action,
  category,
  label,
  value,
  section,
}: TrackEventParams) {
  // Push to dataLayer for GTM
  if (
    typeof window !== "undefined" &&
    (window as WindowWithDataLayer).dataLayer
  ) {
    (window as WindowWithDataLayer).dataLayer!.push({
      event: "custom_event",
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
      section: section,
    });
  }

  // Also log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", { category, action, label, value, section });
  }
}

/**
 * Track CTA clicks
 */
export function trackCTAClick(
  location: "hero" | "final",
  ctaType: "primary" | "secondary"
) {
  trackEvent({
    action: "click",
    category: "cta",
    label: `${location}_${ctaType}`,
    section: location,
  });
}

/**
 * Track WhatsApp button clicks
 */
export function trackWhatsAppClick(source?: string) {
  trackEvent({
    action: "click",
    category: "whatsapp",
    label: source || "float_button",
  });
}

/**
 * Track step views in stepper section
 */
export function trackStepView(stepNumber: number) {
  trackEvent({
    action: "view",
    category: "engagement",
    label: `step_${stepNumber}`,
    value: stepNumber,
    section: "como-funciona",
  });
}

/**
 * Track FAQ question expansion
 */
export function trackFAQOpen(questionId: string) {
  trackEvent({
    action: "expand",
    category: "faq",
    label: questionId,
    section: "faq",
  });
}

/**
 * Track pricing toggle
 */
export function trackPricingToggle(type: "cliente" | "prestador") {
  trackEvent({
    action: "toggle",
    category: "pricing",
    label: type,
    section: "pricing",
  });
}

/**
 * Track page view (call on mount)
 */
export function trackPageView() {
  if (typeof window !== "undefined") {
    trackEvent({
      action: "view",
      category: "navigation",
      label: "landing-v2",
    });
  }
}
