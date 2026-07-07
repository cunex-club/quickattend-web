"use client";

import { cn } from "@assets/lib/utils";
import type { StyleableFC } from "@utils/misc";
import { Link } from "@i18n/navigation";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { useRef, useState } from "react";

/**
 * Indicates interactivity with a ripple effect. The background and state layer
 * colors are applied through Tailwind classes like `bg-red` and
 * `text-white`.
 *
 * @param children The content of the element.
 * @param disabled Whether the element is disabled.
 * @param href The URL to navigate to when the element is clicked. Transforms Interactive into a link.
 * @param type The type to pass to the `<button>` element.
 * @param onClick Called when the element is clicked. Transforms Interactive into a button.
 */
const Interactive: StyleableFC<
  {
    children: ReactNode;
    disabled?: boolean;
    href?: string;
    type?: ComponentProps<"button">["type"];
    onClick?: (event: MouseEvent) => void;
  } & ComponentProps<"button" | "a" | typeof Link>
> = ({
  children,
  disabled,
  href,
  type = "button",
  onClick,
  className,
  ...props
}) => {
  const Element = href
    ? href.startsWith("/")
      ? Link
      : (props: object) => <a {...props} target="_blank" />
    : onClick
      ? `button`
      : `div`;

  const rippleContainerRef = useRef<HTMLSpanElement>(null);
  const [touched, setTouched] = useState(false);

  /**
   * Get the position of the ripple relative to the ripple container.
   *
   * @param clientX The x-coordinate of the mouse/touch event.
   * @param clientY The y-coordinate of the mouse/touch event.
   *
   * @returns The x and y coordinates of the ripple.
   */
  function getRipplePosition({
    clientX,
    clientY,
  }: Pick<Touch, "clientX" | "clientY">) {
    const rect = rippleContainerRef.current?.getBoundingClientRect();
    if (!rect) return [0, 0];
    return [clientX - rect.left, clientY - rect.top];
  }

  /**
   * Create a ripple effect at the given position.
   *
   * @param x The x-coordinate of the ripple.
   * @param y The y-coordinate of the ripple.
   */
  function startRipple(x: number, y: number) {
    const rippleContainer = rippleContainerRef.current;
    if (!rippleContainer) return;

    const ripple = document.createElement(`span`);
    ripple.className = `absolute aspect-square rounded-full opacity-25 bg-current`;
    ripple.style.transform = `scale(0)`;
    ripple.style.transition = `transform 0.5s, opacity 0.5s`;
    rippleContainer.appendChild(ripple);

    const rect = rippleContainer.getBoundingClientRect();
    const diameter = Math.max(rect.width, 80);
    const blurRadius = Math.max(Math.round(rect.width / 10), 4);

    ripple.style.left = x - diameter / 2 + `px`;
    ripple.style.top = y - diameter / 2 + `px`;
    ripple.style.width = diameter + `px`;
    ripple.style.transform = `scale(4)`;
    ripple.style.filter = `blur(${blurRadius}px)`;
  }

  /** Remove all ripples. */
  function endRipple() {
    const rippleContainer = rippleContainerRef.current;
    if (!rippleContainer) return;

    const ripples = rippleContainer.querySelectorAll(`span`);
    for (const ripple of ripples) {
      ripple.style.opacity = `0`;
      setTimeout(() => {
        ripple.remove();
        setTouched(false);
      }, 500);
    }
  }

  return (
    <Element
      href={href!}
      {...(Element === "button" && { type, disabled })}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onClick}
      onTouchStart={(event: React.TouchEvent) => {
        setTouched(true);
        const touch = event.touches[0];
        const [x, y] = getRipplePosition(touch);
        startRipple(x, y);
      }}
      onTouchCancel={endRipple}
      onTouchEnd={endRipple}
      onMouseDown={(event: React.MouseEvent) => {
        // Prevent double ripples on touch devices.
        if (touched) return;
        const [x, y] = getRipplePosition(event);
        startRipple(x, y);
      }}
      onMouseUp={endRipple}
      onMouseLeave={endRipple}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (![`Enter`, ` `].includes(event.key) || touched) return;
        if (!rippleContainerRef?.current) return;
        const rect = rippleContainerRef.current.getBoundingClientRect();
        startRipple(rect.width / 2, rect.height / 2);
        setTimeout(endRipple, 200);
      }}
      className={cn(
        `before:rounded-inherit relative block cursor-pointer touch-manipulation overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:bg-current before:opacity-0 before:transition-opacity before:content-[''] hover:before:opacity-8 focus-visible:before:opacity-10 active:before:opacity-10`,
        disabled && "cursor-not-allowed opacity-50 hover:before:opacity-0",
        className,
      )}
      {...(props as object)}
    >
      <span
        aria-hidden
        ref={rippleContainerRef}
        className="pointer-events-none absolute inset-0 blur-xs select-none"
      />
      {children}
    </Element>
  );
};

export default Interactive;
