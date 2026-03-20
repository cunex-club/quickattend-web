"use client";

import { useEffect, useRef, useState } from "react";

interface MarqueeTextProps {
  text: string;
  className?: string;
}

export default function MarqueeText({ text, className }: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [overflow, setOverflow] = useState(false);
  const [distance, setDistance] = useState(0);

  const SPEED = 80;

  useEffect(() => {
    const check = () => {
      if (!containerRef.current || !textRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.scrollWidth;

      if (textWidth > containerWidth) {
        setOverflow(true);
        setDistance(textWidth + 32); // 32 = gap (mr-8)
      } else {
        setOverflow(false);
      }
    };

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, [text]);

  const duration = distance / SPEED;

  return (
    <div ref={containerRef} className="overflow-hidden w-full group">
      <div
        className="flex whitespace-nowrap"
        style={
          overflow
            ? {
                animation: `marquee-scroll ${duration}s linear infinite`,
                animationDelay: "0.6s",
                "--marquee-distance": `-${distance}px`,
              } as React.CSSProperties
            : undefined
        }
      >
        <div ref={textRef} className={`mr-8 ${className}`}>
          {text}
        </div>

        {overflow && (
          <div className={`mr-8 ${className}`}>
            {text}
          </div>
        )}
      </div>
    </div>
  );
}