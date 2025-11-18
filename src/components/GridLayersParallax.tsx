import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const GridLayersParallax = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    fetch("/img/grid-layers.svg")
      .then((response) => response.text())
      .then((svg) => setSvgContent(svg))
      .catch((err) => console.error("Error loading SVG:", err));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgContent) return;

    setTimeout(() => {
      const svg = container.querySelector("svg");
      if (!svg) {
        console.log("SVG not found");
        return;
      }

      svg.style.overflow = "visible";

      const layer1 = svg.querySelector("#layer-1");
      const layer2 = svg.querySelector("#layer-2");
      const layer3 = svg.querySelector("#layer-3");
      const layer4 = svg.querySelector("#layer-4");

      if (!layer1 || !layer2 || !layer3 || !layer4) {
        console.log("Layers not found:", { layer1, layer2, layer3, layer4 });
        return;
      }

      gsap.set(layer1, { transform: "translate3d(0, -30px, 0)" });
      gsap.set(layer2, { transform: "translate3d(0, -15px, 0)" });
      gsap.set(layer3, { transform: "translate3d(0, 15px, 0)" });
      gsap.set(layer4, { transform: "translate3d(0, 30px, 0)" });

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: "top 80%",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          const layer1Y = progress * 90 - 30; // Starts at -30px, ends at +60px
          const layer2Y = progress * 45 - 15; // Starts at -15px, ends at +30px
          const layer3Y = -progress * 45 + 15; // Starts at +15px, ends at -30px
          const layer4Y = -progress * 90 + 30; // Starts at +30px, ends at -60px

          gsap.set(layer1, {
            transform: `translate3d(0, ${layer1Y}px, 0)`,
          });

          gsap.set(layer2, {
            transform: `translate3d(0, ${layer2Y}px, 0)`,
          });

          gsap.set(layer3, {
            transform: `translate3d(0, ${layer3Y}px, 0)`,
          });

          gsap.set(layer4, {
            transform: `translate3d(0, ${layer4Y}px, 0)`,
          });
        },
      });

      return () => {
        trigger.kill();
      };
    }, 100);
  }, [svgContent]);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-1/2 sm:w-auto w-[70vw]"
      style={{
        width: 687,
        height: 450, 
        transform: "translateX(-50%) translateY(68%) scale(0.8)",
        overflow: "visible",
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
