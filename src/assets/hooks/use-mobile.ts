import * as React from "react";

const BREAKPOINTS = {
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

// Hook to detect if viewport is mobile (< 768px / md breakpoint)
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.MD - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MD);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < BREAKPOINTS.MD);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

// Hook to detect if viewport is tablet (768px - 1023px / md to lg breakpoint)
export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`,
    );
    const onChange = () => {
      setIsTablet(
        window.innerWidth >= BREAKPOINTS.MD &&
          window.innerWidth < BREAKPOINTS.LG,
      );
    };
    mql.addEventListener("change", onChange);
    setIsTablet(
      window.innerWidth >= BREAKPOINTS.MD && window.innerWidth < BREAKPOINTS.LG,
    );
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isTablet;
}

// Hook to detect if viewport is iPad Pro size (1024px - 1279px / lg to xl breakpoint)
export function useIsIpadPro() {
  const [isIpadPro, setIsIpadPro] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(min-width: ${BREAKPOINTS.LG}px) and (max-width: ${BREAKPOINTS.XL - 1}px)`,
    );
    const onChange = () => {
      setIsIpadPro(
        window.innerWidth >= BREAKPOINTS.LG &&
          window.innerWidth < BREAKPOINTS.XL,
      );
    };
    mql.addEventListener("change", onChange);
    setIsIpadPro(
      window.innerWidth >= BREAKPOINTS.LG && window.innerWidth < BREAKPOINTS.XL,
    );
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isIpadPro;
}

// Hook to detect if viewport is desktop (>= 1280px / xl breakpoint)
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS.XL}px)`);
    const onChange = () => {
      setIsDesktop(window.innerWidth >= BREAKPOINTS.XL);
    };
    mql.addEventListener("change", onChange);
    setIsDesktop(window.innerWidth >= BREAKPOINTS.XL);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isDesktop;
}
