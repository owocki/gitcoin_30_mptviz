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

    let trigger: ScrollTrigger | null = null;
    let layerRefs: {
      layer1: Element | null;
      layer2: Element | null;
      layer3: Element | null;
      layer4: Element | null;
    } = { layer1: null, layer2: null, layer3: null, layer4: null };

    const timeoutId = setTimeout(() => {
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

      layerRefs = { layer1, layer2, layer3, layer4 };

      gsap.set(layer1, { y: -30 });
      gsap.set(layer2, { y: -15 });
      gsap.set(layer3, { y: 15 });
      gsap.set(layer4, { y: 30 });

      trigger = ScrollTrigger.create({
        trigger: container,
        start: "top 80%",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (!layerRefs.layer1 || !layerRefs.layer2 || !layerRefs.layer3 || !layerRefs.layer4) {
            return;
          }

          const progress = self.progress;

          const layer1Y = progress * 90 - 30; // Starts at -30px, ends at +60px
          const layer2Y = progress * 45 - 15; // Starts at -15px, ends at +30px
          const layer3Y = -progress * 45 + 15; // Starts at +15px, ends at -30px
          const layer4Y = -progress * 90 + 30; // Starts at +30px, ends at -60px

          gsap.set(layerRefs.layer1, { y: layer1Y });
          gsap.set(layerRefs.layer2, { y: layer2Y });
          gsap.set(layerRefs.layer3, { y: layer3Y });
          gsap.set(layerRefs.layer4, { y: layer4Y });
        },
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (trigger) {
        trigger.kill();
      }
      layerRefs = { layer1: null, layer2: null, layer3: null, layer4: null };
    };
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
