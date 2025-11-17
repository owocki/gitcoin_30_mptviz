import { ReactNode, useState, useRef } from "react";
import { tv } from "tailwind-variants";

const button = tv({
  base: "w-fit text-center leading-none flex-shrink-0 transition-all duration-300 tracking-[0.56px]",
  variants: {
    variant: {
      primary: "bg-sand text-moss-500  hover:bg-moss-300",
      secondary: "bg-transparent text-iris-900 border border-iris-900",
      tertiary:
        "bg-moss-900 text-moss-100 border border-moss-100 rounded-2xl hover:bg-moss-300",
      destructive:
        "bg-moss-900 text-red-500 border border-red-500 rounded-2xl hover:bg-moss-300",
      ghost: "bg-transparent ",
    },
    size: {
      lg: "py-3.5 px-5 rounded-md",
      m: "py-3 px-3 rounded-md text-sm",
      s: "py-1.5 px-2 rounded-md text-sm",
    },
    isLoading: {
      true: "opacity-50",
    },
    disabled: {
      true: "opacity-40 cursor-not-allowed",
    },
  },
});

const CHARACTERS = "abcdefghijklnpqrstuvxyz";

export const Button = ({
  variant = "primary",
  size = "lg",
  onClick,
  isLoading,
  className,
  disabled,
  children,
  hoverAnimation = false,
  ...props
}: {
  variant?: "primary" | "secondary" | "ghost" | "tertiary" | "destructive";
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  isLoading?: boolean;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  size?: "lg" | "m" | "s";
  hoverAnimation?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [displayText, setDisplayText] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<number | null>(null);
  const originalText = typeof children === "string" ? children : "";

  const handleMouseEnter = () => {
    if (!hoverAnimation || !originalText) return;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    let iteration = 0;
    let lastTime = 0;
    const frameDelay = 30; // ms between updates

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameDelay) {
        setDisplayText(
          originalText
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) {
                return originalText[index];
              }
              return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            })
            .join("")
        );

        // Calculate progress and apply easing
        const progress = iteration / originalText.length;
        const easedProgress = easeOut(progress);
        // Start with more characters (5), end with fewer (1)
        const increment = Math.max(1, Math.floor(5 * (1 - easedProgress)));

        iteration += increment;
        lastTime = currentTime;

        if (iteration >= originalText.length) {
          setDisplayText(originalText);
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseLeave = () => {
    if (!hoverAnimation) return;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setDisplayText(originalText);
  };

  return (
    <button
      ref={buttonRef}
      disabled={!!isLoading || !!disabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${button({
        variant,
        size,
        isLoading: !!isLoading,
        disabled: !!disabled,
      })} ${className}`}
      style={{
        ...props.style,
      }}
      {...props}
    >
      {hoverAnimation && originalText ? (
        <span
          style={{
            display: "inline-block",
            minWidth: className?.includes("uppercase")
              ? `${originalText.length * 1.1}ch`
              : `${originalText.length}ch`,
          }}
        >
          {displayText || children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};
