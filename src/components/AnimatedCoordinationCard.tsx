import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const element = cardRef.current;
    const heading = headingRef.current;
    if (!element || !heading) return;

    const ctx = gsap.context(() => {
      // Animate card sliding in from right
      gsap.to(element, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Animate heading sliding up
      gsap.to(heading, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      style={{ opacity: 0, transform: "translateX(50px)" }}
    >
      <div className="pr-4 py-6 pl-8 md:pl-12 bg-lichen-100 border border-moss-500/25 rounded-lg relative">
        <h4
          ref={headingRef}
          className="text-moss-500 font-semibold text-xl sm:text-2xl font-mori mb-2"
          style={{ opacity: 0, transform: "translateY(30px)" }}
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
