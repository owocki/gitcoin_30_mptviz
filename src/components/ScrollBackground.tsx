import { useEffect, useState } from "react";

export const ScrollBackground = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const transitionPoint = document.getElementById("bg-transition-point");
    if (!transitionPoint) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsLight(entry.isIntersecting);
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -50% 0px",
      }
    );

    observer.observe(transitionPoint);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        backgroundColor: isLight ? "#F2FBF8" : "#0C2725",
        transition: "background-color 800ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    />
  );
};
