import { useEffect, useRef, useState } from "react";

const CHARACTERS = "abcdefghijklnpqrstuvxyz";

type ScrambleTextProps = {
  children: string;
  className?: string;
  delay?: number;
};

export const ScrambleText = ({
  children,
  className = "",
  delay = 0,
}: ScrambleTextProps) => {
  const [displayText, setDisplayText] = useState(children);
  const animationRef = useRef<number | null>(null);

  const startAnimation = () => {
    const originalText = children;

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

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

  // Play animation on mount
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      startAnimation();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [children, delay]);

  const handleMouseEnter = () => {
    startAnimation();
  };

  return (
    <span className={className} onMouseEnter={handleMouseEnter}>
      {displayText}
    </span>
  );
};
