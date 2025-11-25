import { useEffect, useState } from "react";

export const useScrollProgress = (
  ref: React.RefObject<HTMLElement | null>
): number => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const start = rect.top;
        const height = rect.height;
        let p = (windowHeight - start) / (windowHeight + height);
        p = Math.min(Math.max(p, 0), 1);
        setProgress(p);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return progress;
};
