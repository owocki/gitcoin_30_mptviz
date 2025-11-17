import { useEffect, useRef, useState } from "react";

type CoordinationItem = {
  name: string;
  description: string;
};

export const AnimatedCoordinationCard = ({
  item,
  index,
}: {
  item: CoordinationItem;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = cardRef.current;
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
        rootMargin: "0px 0px -20% 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translate3d(0, 0, 0)"
          : "translate3d(50px, 0, 0)",
      }}
    >
      <div className="pr-4 py-6 pl-8 md:pl-12 bg-lichen-100 border border-moss-500/25 rounded-lg relative">
        <h4
          className="text-moss-500 font-semibold text-xl sm:text-2xl font-mori mb-2 transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? "translate3d(0, 0, 0)"
              : "translate3d(0, 30px, 0)",
            transitionDelay: "0.1s",
          }}
        >
          {item.name}
        </h4>
        <p className="text-moon-900">{item.description}</p>

        <div className="absolute top-1/2 -translate-x-1/2 left-0 -translate-y-1/2">
          <div className="md:size-16 size-10 flex items-center justify-center text-3xl md:text-4xl bg-lichen-100 border border-moss-500/25 rounded-full">
            {index + 1}
          </div>
        </div>
      </div>
    </div>
  );
};
