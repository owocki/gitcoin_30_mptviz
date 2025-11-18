import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const ScrollImageTransition = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const position1 = document.getElementById('position1');
    const position2 = document.getElementById('position2');
    const movingImage = imageRef.current;

    if (!position1 || !position2 || !movingImage) {
      console.log('Elements not found:', { position1, position2, movingImage });
      return;
    }

    // Hide only position2 on desktop (position1 stays visible until animation starts)
    if (position2.parentElement) position2.parentElement.style.opacity = '0';

    // Set initial state - hidden, will be positioned when animation starts
    gsap.set(movingImage, {
      position: 'fixed',
      xPercent: -50,
      yPercent: -50,
      zIndex: 1000,
      opacity: 0,
    });

    // Get the section containing position1 to use as trigger
    const section1 = position1.closest('section');

    if (!section1) return;

    // Store the locked start position
    let startX = 0;
    let startY = 0;

    // Create ScrollTrigger that updates position based on scroll
    // Start when section1's bottom reaches center of viewport
    // End when we reach position2
    ScrollTrigger.create({
      trigger: section1,
      start: 'bottom 70%',
      endTrigger: position2,
      end: 'center center',
      scrub: 1,
      onEnter: () => {
        // Lock in position1's current viewport location as start position
        const rect1 = position1.getBoundingClientRect();
        startX = rect1.left + rect1.width / 2;
        startY = rect1.top + rect1.height / 2;

        // Hide position1 and show moving image at that location
        if (position1.parentElement) position1.parentElement.style.opacity = '0';
        gsap.set(movingImage, {
          left: startX,
          top: startY,
          opacity: 1,
        });
      },
      onLeaveBack: () => {
        // Show position1 again and instantly hide moving image when scrolling back
        if (position1.parentElement) position1.parentElement.style.opacity = '';
        gsap.set(movingImage, { opacity: 0 });
      },
      onLeave: () => {
        // Animation complete - show position2 with brightness filter and hide moving image
        if (position2.parentElement) {
          position2.parentElement.style.opacity = '';
          // Apply the same brightness filter to position2
          (position2 as HTMLElement).style.filter = 'brightness(6) contrast(0.8)';
        }
        gsap.set(movingImage, { opacity: 0 });
      },
      onEnterBack: () => {
        // Scrolling back into animation zone - hide position2 and show moving image
        if (position2.parentElement) position2.parentElement.style.opacity = '0';
        gsap.set(movingImage, { opacity: 1 });
      },
      onUpdate: (self) => {
        const progress = self.progress;

        // Get position2's current viewport position (end target)
        const rect2 = position2.getBoundingClientRect();
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;

        // Interpolate from locked start position to current end position
        const currentX = startX + (x2 - startX) * progress;
        const currentY = startY + (y2 - startY) * progress;

        // Interpolate filter from dark to light as it approaches position2
        // At progress 0.5, start transitioning to white/inverted
        const filterProgress = Math.max(0, (progress - 0.5) / 0.5);
        const brightness = 1 + filterProgress * 5; // Goes from 1 to 6

        gsap.set(movingImage, {
          left: currentX,
          top: currentY,
          filter: `brightness(${brightness}) contrast(0.8)`,
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (position1.parentElement) position1.parentElement.style.opacity = '';
      if (position2.parentElement) position2.parentElement.style.opacity = '';
    };
  }, [isDesktop]);

  // Only render on desktop
  if (!isDesktop) {
    return null;
  }

  return (
    <img
      ref={imageRef}
      src="/img/coordination-globe-graphic.svg"
      width="400"
      height="396"
      alt=""
      style={{
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
};
