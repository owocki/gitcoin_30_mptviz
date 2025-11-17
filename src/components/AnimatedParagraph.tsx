import { useEffect, useRef, useState } from "react";

type AnimatedParagraphProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export const AnimatedParagraph = ({
  children,
  className = "",
  delay = 0,
}: AnimatedParagraphProps) => {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    const element = paragraphRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(element);

    let ticking = false;

    const updateOpacity = () => {
      if (!element) {
        ticking = false;
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;

      // Distance from viewport center
      const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
      const maxDistance = window.innerHeight / 2;

      // Normalize distance (0 when centered, 1 when far)
      const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);

      const calculatedOpacity = 1 - normalizedDistance * 0.8;

      setOpacity(Math.max(calculatedOpacity, 0.2));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateOpacity);
        ticking = true;
      }
    };

    updateOpacity(); 
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <p
      ref={paragraphRef}
      className={className}
      style={{
        opacity: isVisible ? opacity : 0,
        transform: isVisible
          ? "translate3d(0, 0, 0)"
          : "translate3d(-60px, 20px, 0)",
        transition: isVisible
          ? "none"
          : `all 700ms ease-out ${delay}s`,
      }}
    >
      {children}
    </p>
  );
};
