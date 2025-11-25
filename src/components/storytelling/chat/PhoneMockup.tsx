"use client";

import React, { useEffect, useState } from "react";
import { PhoneMockupProps } from "../types";

export const PhoneMockup = React.memo(
  ({ children, scale = 1 }: PhoneMockupProps) => (
    <div
      className="relative w-[260px] h-[520px] sm:w-[300px] sm:h-[600px] md:w-[340px] md:h-[680px] lg:w-[380px] lg:h-[760px] transition-all duration-[800ms] ease-out shadow-2xl rounded-[3rem] bg-gray-900 border-[8px] border-gray-900 ring-1 ring-white/20"
      style={{ transform: `scale(${scale})` }}
    >
      <div className="absolute inset-0 bg-gray-900 rounded-[2.5rem] overflow-hidden z-20 flex flex-col">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-gray-900 rounded-b-xl z-40"></div>
        <div className="w-full h-7 bg-[#054D44] flex justify-between items-center px-6 pt-2 shrink-0 z-30 select-none">
          <CurrentTime />
          <div className="flex gap-1">
            <div className="w-3 h-2 bg-white/90 rounded-sm"></div>
          </div>
        </div>
        <div className="flex-1 bg-[#EFEAE2] relative overflow-hidden flex flex-col">
          <div
            className="absolute inset-0 opacity-[0.4] pointer-events-none"
            style={{
              backgroundImage:
                'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
              backgroundSize: "400px",
            }}
          ></div>
          {children}
        </div>
      </div>
    </div>
  )
);

PhoneMockup.displayName = "PhoneMockup";

const CurrentTime = () => {
  const [timeString, setTimeString] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeString(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-[10px] font-medium text-white/90 pl-2">
      {timeString}
    </span>
  );
};
