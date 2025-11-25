import React from "react";
import type { LucideIcon } from "lucide-react";

export type ChatMessageType = "pix_combo" | "info";

export interface ChatMessage {
  id: number;
  section: number;
  isUser?: boolean;
  text: string;
  delay: number;
  type?: ChatMessageType;
  code?: string;
}

export type StepAlignment = "left" | "right";

export interface StepContent {
  id: number;
  ref: React.RefObject<HTMLDivElement | null>;
  anchorId: string;
  alignment: StepAlignment;
  icon: LucideIcon;
  iconContainerClass: string;
  title: string;
  description: React.ReactNode;
}

export interface PhoneMockupProps {
  children: React.ReactNode;
  scale?: number;
}

