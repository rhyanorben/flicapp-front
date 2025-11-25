export const STORY_SECTION_IDS = {
  hero: "story-hero",
  steps: [
    "story-step-1",
    "story-step-2",
    "story-step-3",
    "story-step-4",
    "story-step-5",
  ],
  cta: "story-cta",
  dashboard: "story-dashboard",
  about: "story-about",
  faq: "story-faq",
} as const;

export const STORY_WHATSAPP_LINK =
  process.env.NEXT_PUBLIC_WHATSAPP_LINK ?? "https://wa.me/5511999999999";
