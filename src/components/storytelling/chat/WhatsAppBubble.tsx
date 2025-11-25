"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CheckCheck } from "lucide-react";
import { ChatMessage } from "../types";

interface WhatsAppBubbleProps {
  message: ChatMessage;
  visible: boolean;
  onShow: () => void;
}

export const WhatsAppBubble = React.memo(
  ({ message, visible, onShow }: WhatsAppBubbleProps) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
      if (visible) {
        const timer = setTimeout(() => {
          setShow(true);
          requestAnimationFrame(onShow);
        }, message.delay);
        return () => clearTimeout(timer);
      }
      setShow(false);
      return undefined;
    }, [visible, message.delay, onShow]);

    if (!show) return null;

    const isUser = message.isUser;
    const qrCodeValue = message.type === "pix_combo" ? message.code ?? "" : "";

    return (
      <div
        className={`flex w-full mb-2 ${
          isUser ? "justify-end" : "justify-start"
        } animate-message-pop ${
          isUser ? "origin-bottom-right" : "origin-bottom-left"
        }`}
      >
        {message.type === "info" ? (
          <div className="flex justify-center w-full my-2">
            <span className="bg-[#FFF5C4] text-gray-600 text-xs px-3 py-1 rounded shadow-sm font-medium uppercase">
              {message.text}
            </span>
          </div>
        ) : (
          <div
            className={`max-w-[85%] p-2 rounded-lg shadow-sm text-[14px] leading-snug relative overflow-x-hidden ${
              isUser
                ? "bg-[#E7FFDB] text-gray-900 rounded-tr-none"
                : "bg-white text-gray-900 rounded-tl-none"
            }`}
          >
            {message.type === "pix_combo" ? (
              <div className="flex flex-col gap-2">
                <div className="bg-white p-2 rounded border border-gray-100 flex justify-center">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      qrCodeValue
                    )}&bgcolor=ffffff`}
                    alt="QR"
                    width={96}
                    height={96}
                    className="w-24 h-24 mix-blend-multiply"
                  />
                </div>
                <div className="bg-gray-50 p-2 rounded text-[10px] font-mono text-gray-600 border border-dashed border-gray-300 truncate">
                  {qrCodeValue}
                </div>
                <div className="whitespace-pre-wrap mt-1 text-sm">
                  {message.text}
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.text}</div>
            )}
            <div className="flex justify-end items-end gap-0.5 mt-1 opacity-60">
              <span className="text-[10px]">10:00</span>
              {isUser && <CheckCheck size={14} className="text-[#53BDEB]" />}
            </div>
          </div>
        )}
      </div>
    );
  }
);

WhatsAppBubble.displayName = "WhatsAppBubble";
