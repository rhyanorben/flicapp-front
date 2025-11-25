"use client";

import React from "react";
import { ArrowLeft, MoreVertical, Phone, Video, Zap } from "lucide-react";

export const WhatsAppHeader = React.memo(() => (
  <div className="bg-[#008069] text-white px-3 py-2 flex items-center gap-2 shadow-md z-30 relative shrink-0 h-[60px]">
    <div className="flex items-center">
      <ArrowLeft size={20} />
    </div>
    <div className="w-9 h-9 ml-1 rounded-full bg-white p-0.5 overflow-hidden flex-shrink-0">
      <div className="w-full h-full bg-indigo-600 flex items-center justify-center rounded-full">
        <Zap size={18} fill="white" />
      </div>
    </div>
    <div className="flex-1 ml-2 overflow-hidden">
      <div className="font-semibold text-base leading-tight truncate">
        FlicApp 🤖
      </div>
      <div className="text-[11px] opacity-90 truncate">Conta comercial</div>
    </div>
    <div className="flex gap-4 pr-1 text-white">
      <Video size={20} />
      <Phone size={18} />
      <MoreVertical size={18} />
    </div>
  </div>
));

WhatsAppHeader.displayName = "WhatsAppHeader";
