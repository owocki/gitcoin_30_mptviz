import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { HeroAnimation } from "../components/HeroAnimation";
import EarthGraphic from "../components/EarthGraphic";
import TrapGraphic from "../components/TrapGraphic";
import { AnimatedCoordinationCard } from "../components/AnimatedCoordinationCard";
import { AnimatedParagraph } from "../components/AnimatedParagraph";
import { StickyHeader } from "../components/StickyHeader";
import { ScrollBackground } from "../components/ScrollBackground";
import { ScrollImageTransition } from "../components/ScrollImageTransition";
import { GridLayersParallax } from "../components/GridLayersParallax";
import { ScrambleText } from "../components/ScrambleText";
import galleryData from "../config/gallery.json";

interface GalleryItem {
  id: string;
  title: string;
  previewUrl: string;
  fullUrl: string;
}

const traps = [
  {
    title: "Open Source underfunding",
    problem: "Shared resources depleted by individual use",
    outcome: "-",
    steps: [
      "Open Source underfunding",
      "Quadratic funding",
      "Fairer shared contribution",
    ],
    colors: {
      lightBg: "bg-nectar-100",
      bg: "bg-nectar-300",
      text: "text-nectar-900",
      border: "border-nectar-900",
    },
    description:
      "Small donors get matched by a larger funding pool, amplifying grassroots support. Projects valued by many people (not just whales) receive proportionally more funding. The community signals what matters through small contributions. This mechanism has already allocated millions to open-source software, research, and local communities.",
    projects: [
      {
        url: "https://grants.gitcoin.co/",
        logoUrl: "/img/logos/grants-logo.svg",
        width: 162,
        height: 38,
        alt: "Gitcoin Grants",
      },
      {
        url: "https://clr.fund/",
        logoUrl: "/img/logos/clr-logo.svg",
        width: 114,
        height: 38,
        alt: "clr.fund",
      },
      {
        url: "https://giveth.io/",
        logoUrl: "/img/logos/giveth-logo.svg",
        width: 99,
        height: 38,
        alt: "Giveth",
      },
    ],
  },
  {
    title: "Social Media overuse",
    problem: "Platforms maximize engagement",
    outcome: "Mental health crisis",
    steps: [
      "Social Media overuse",
      "Reputation + attestations",
      "Credibility over virality",
    ],
    colors: {
      lightBg: "bg-lichen-100",
      bg: "bg-lichen-500",
      text: "text-moss-500",
      border: "border-moss-500",
    },
    description:
      "Reputation systems built on verifiable credentials make trust portable and transparent. Attestations from credible sources are recorded on-chain. Users can verify claims independently without trusting platforms. Networks of trust emerge based on actual behavior, not engagement metrics. Overuse become expensive; more health behaviour becomes profitable.",
    projects: [
      {
        url: "https://passport.gitcoin.co/",
        logoUrl: "/img/logos/human-logo.svg",
        width: 151,
        height: 38,
        alt: "Human Passport",
      },
      {
        url: "https://attest.sh/",
        logoUrl: "/img/logos/eas-logo.svg",
        width: 77,
        height: 38,
        alt: "Ethereum Attestation Service",
      },
      {
        url: "https://www.clique.social/",
        logoUrl: "/img/logos/clique-logo.svg",
        width: 98,
        height: 38,
        alt: "Clique",
      },
    ],
  },
  {
    title: "AI arms race",
    problem: "Every lab rushes ahead",
    outcome: "Global risk increases",
    steps: [
      "AI arms race",
      "Open models + attestations",
      "Shared safety incentives",
    ],
    colors: {
      lightBg: "bg-sun-100",
      bg: "bg-sun-500",
      text: "text-sun-900",
      border: "border-sun-900",
    },
    description:
      "AI development becomes transparent through on-chain attestations. Teams commit to safety protocols via smart contracts. Open-source models with verified safety checks get funding through quadratic mechanisms. Whistleblowers can anonymously report violations. The race becomes who can build the safest AI, not just the fastest.",
    projects: [
      {
        url: "https://oceanprotocol.com/",
        logoUrl: "/img/logos/ocean-logo.svg",
        width: 168,
        height: 38,
        alt: "Ocean Protocol",
      },
      {
        url: "https://bittensor.com/",
        logoUrl: "/img/logos/bittensor-logo.svg",
        width: 116,
        height: 38,
        alt: "Bittensor",
      },
      {
        url: "https://www.theoriq.ai/",
        logoUrl: "/img/logos/theoriq-logo.svg",
        width: 122,
        height: 38,
        alt: "Theoriq",
      },
    ],
  },

  {
    title: "Climate inaction",
    problem: "Everyone pollutes",
    outcome: "Earth suffers",
    steps: [
      "Climate inaction",
      "Tokenized carbon credits",
      "Verified action, shared cost",
    ],
    colors: {
      lightBg: "bg-iris-100",
      bg: "bg-iris-500",
      text: "text-iris-900",
      border: "border-iris-900",
    },
    description:
      "Carbon credits are tokenized on-chain, making emissions reduction transparent and tradeable. Communities can pool funds to buy and retire credits. Smart contracts automatically verify and reward climate-positive actions. Everyone can see who's contributing, creating social and economic incentives to participate.",
    projects: [
      {
        url: "https://toucan.earth/",
        logoUrl: "/img/logos/toucan-logo.svg",
        width: 175,
        height: 38,
        alt: "Toucan Protocol",
      },
      {
        url: "https://www.regen.network/",
        logoUrl: "/img/logos/regen-logo.svg",
        width: 165,
        height: 38,
        alt: "Regen Network",
      },
      {
        url: "https://www.klimadao.finance/",
        logoUrl: "/img/logos/klima-logo.svg",
        width: 131,
        height: 38,
        alt: "Klima DAO",
      },
    ],
  },
];

const RightArrow = () => (
  <svg
    width="21"
    height="18"
    viewBox="0 0 21 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.8558 10.1039L13.3678 17.6159L11.3518 15.9359L17.1838 10.1039H-0.000183582V7.48792H17.2078L11.3758 1.67992L13.3678 -7.9155e-05L20.8558 7.48792V10.1039Z"
      fill="currentColor"
    />
  </svg>
);
const coordination = [
  {
    name: "See",
    description:
      "Shared visibility into the problem. Everyone needs to see the same truth - the state of the commons, the actions of others, and the consequences of inaction.",
  },
  {
    name: "Coordinate",
    description:
      "Communicate and align on shared goals. Networks of bottom-up, peer-to-peer people can self-organize if they have the right tools to signal intentions and build consensus.",
  },
  {
    name: "Commit",
    description:
      "Make credible, enforceable commitments. Without a way to lock in cooperation, the temptation to defect always wins. We need mechanisms that make cooperation the rational choice.",
  },
];

const CardWithBorder = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-md py-4 px-5 text-moss-500 border border-moss-500 font-mori font-semibold text-3xl md:text-5xl
        ${className}`}
  >
    {children}
  </div>
);

const AlignmentIssuesSection = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<"next" | "prev">("next");

  const handlePrevious = () => {
    setDirection("prev");
    setCurrentIndex((prev) => (prev === 0 ? traps.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection("next");
    setCurrentIndex((prev) => (prev === traps.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? "next" : "prev");
    setCurrentIndex(index);
  };

  const renderTrap = (trap: (typeof traps)[0]) => (
    <div className="flex items-center justify-center relative w-full py-4">
      <div className="relative inline-block mx-auto max-w-[90vw] md:max-w-[600px]">
        {/* Graphic defines the size */}
        <div className="relative">
          <TrapGraphic
            className={`block w-full h-auto max-h-[60vh] md:max-h-[70vh] ${trap.colors.text}`}
          />
          {/* Position text using transform to maintain consistency */}
          <div className="absolute text-lichen-500 font-mori text-[clamp(8px,1.5vw,14px)] w-[22ch] sm:text-right top-[86%] left-[0%] sm:top-[86%] sm:left-[7%] sm:-translate-y-1/2">
            {trap.problem}
          </div>
          <div className="absolute text-nectar-500 font-mori text-[clamp(8px,1.5vw,14px)] top-[110%] right-[0%] -translate-y-1/2    sm:top-[90%] sm:right-[4%] sm:-translate-x-1/2 sm:-translate-y-1/2">
            {trap.outcome}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-8 md:py-16 px-2 lg:px-20 min-h-[70vh] sm:min-h-screen">
      <div className="">
        <h2 className="mb-8 md:mb-12 text-moss-100 font-mori font-semibold text-2xl sm:text-4xl md:text-5xl text-center">
          Alignment issues
        </h2>
        <div className="relative flex items-center justify-center gap-2 md:gap-8">
          {/* Left Arrow */}
          <button
            onClick={handlePrevious}
            className="flex-shrink-0 p-4 hover:opacity-70 transition-opacity"
            aria-label="Previous trap"
          >
            <img
              src="/img/carousel-left-arrow.svg"
              alt="Previous"
              className="w-8 h-8 sm:w-12 sm:h-12"
            />
          </button>

          {/* Carousel Content */}
          <div className="flex-1 max-w-4xl overflow-hidden relative">
            <div
              className="relative w-full flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {traps.map((trap, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  {renderTrap(trap)}
                  <div className="text-moss-100 text-center font-mori text-xl sm:text-3xl mt-3">
                    {trap.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="flex-shrink-0 p-4 hover:opacity-70 transition-opacity"
            aria-label="Next trap"
          >
            <img
              src="/img/carousel-right-arrow.svg"
              alt="Next"
              className="w-8 h-8 sm:w-12 sm:h-12"
            />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {traps.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-moss-100 w-8"
                  : "bg-moss-100/30 hover:bg-moss-100/50"
              }`}
              aria-label={`Go to trap ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
const TrapsSection = () => {
  return (
    <section className="relative">
      {traps.map((trap, i) => (
        <div
          key={i}
          className="sticky top-0 h-screen"
          style={{ zIndex: i + 1 }}
        >
          <div
            className={`${trap.colors.bg} h-full flex flex-col md:flex-row items-center justify-between md:pl-20 py-10 gap-8 sm:px-0 px-3`}
          >
            <div className="w-full flex items-center justify-center flex-col">
              <div className="flex flex-col justify-start">
                <div
                  className={`py-2 px-3 rounded-md ${trap.colors.lightBg} ${trap.colors.text} font-semibold w-fit mb-4 md:mb-6 text-xs md:text-sm`}
                >
                  Multipolar Trap → Ethereum Solution
                </div>
                <p className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center gap-2">
                  {trap.steps.map((entry, stepIndex) => (
                    <div
                      key={stepIndex}
                      className="flex items-center gap-2 font-semibold text-sm md:text-xl"
                    >
                      <span>{entry}</span>
                      {stepIndex !== trap.steps.length - 1 && <RightArrow />}
                    </div>
                  ))}
                </p>
                <p className="max-w-xl mb-8 md:mb-12 text-sm md:text-base">
                  {trap.description}
                </p>

                <div
                  className={`w-fit flex items-center gap-2.5 flex-wrap px-4 py-2 rounded-2xl border ${trap.colors.border} ${trap.colors.text}`}
                >
                  <span className="mr-4 leading-none">
                    Projects working on this
                  </span>
                  {trap.projects.map((entry, idx) => (
                    <a key={idx} href={entry.url} className="leading-none">
                      <Button
                        size="s"
                        variant="secondary"
                        className={`!py-0 !px-0 border ${trap.colors.border} ${trap.colors.text}`}
                      >
                        <img
                          src={entry.logoUrl}
                          width={entry.width}
                          height={entry.height}
                          alt={entry.alt}
                        />
                      </Button>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block flex-shrink-0">
              <EarthGraphic
                className={`max-h-[90vh] w-auto ${trap.colors.text}`}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

const NetworkedCoordinationSection = () => {
  const [isCardsVisible, setIsCardsVisible] = React.useState(false);
  const cardsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = cardsRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsCardsVisible(entry.isIntersecting);
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

  const cards = [
    {
      title: "Transparency",
      description: "to see what's happening",
      iconSrc: "/img/icon-1.svg",
    },
    {
      title: "Communication channels",
      description: "to align on goals",
      iconSrc: "/img/icon-2.svg",
    },
    {
      title: "Incentive alignment",
      description: "to reward collective action",
      iconSrc: "/img/icon-3.svg",
    },
    {
      title: "Commitment devices",
      description: "to lock in cooperation",
      iconSrc: "/img/icon-4.svg",
    },
  ];

  return (
    <section className="pt-10 md:pt-20 px-5 md:px-20">
      <div className="relative z-[15] mb-44 md:mb-60">
        <div className="relative h-[220px] md:h-[250px] max-w-5xl ml-0 md:ml-[20%]">
          <CardWithBorder className="absolute top-0 left-[20px] md:left-[50px]">
            The Power
          </CardWithBorder>
          <CardWithBorder className="absolute top-[60px] right-0 md:left-[300px] w-fit">
            of Networked
          </CardWithBorder>
          <CardWithBorder className="absolute top-[120px] left-0">
            Coordination
          </CardWithBorder>
        </div>
      </div>

      <div className="relative flex flex-col md:flex-row items-start justify-center gap-6 md:gap-10">
        {/* Scrolling stacked cards on the left */}
        <div className="relative max-w-full md:max-w-[377px] w-full">
          {/* Text section */}
          <div
            className="sticky top-[calc((100vh+59px)/2)] -translate-y-1/2 h-auto md:h-[498px] transition-opacity duration-700 ease-out"
            style={{
              zIndex: 1,
              opacity: isCardsVisible ? 0 : 1,
            }}
          >
            <div className="bg-moss-500 rounded-lg py-6 md:py-8 px-6 sm:px-10 md:px-8 text-moss-100 flex flex-col gap-6 md:gap-9 h-full">
              <p>
                Top-down institutions are slow, captured, or corrupt. But
                networks of ordinary people—citizens, developers,
                communities—can coordinate at scale if given the right
                infrastructure.
              </p>
              <p>
                When these pieces come together, bottom-up coordination becomes
                possible—and powerful enough to diffuse multipolar traps.
              </p>
              <p>
                Peer-to-peer networks don't need permission. They don't need
                central authorities.
              </p>
            </div>
          </div>

          <div
            ref={cardsRef}
            className="sticky top-[calc((100vh+59px)/2)] -translate-y-1/2 h-auto md:h-[498px]"
            style={{
              zIndex: 2,
            }}
          >
            <div className="h-full flex flex-col justify-between bg-moss-100 gap-2">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-moss-500 rounded-lg py-3 md:py-6 px-6 sm:px-10 md:px-8 transition-all duration-700 ease-out"
                  style={{
                    opacity: isCardsVisible ? 1 : 0,
                    transform: isCardsVisible
                      ? "translateY(0)"
                      : "translateY(20px)",
                    transitionDelay: `${index * 250}ms`,
                  }}
                >
                  <div className="size-12 flex-shrink-0">
                    <img src={card.iconSrc} alt="" />
                  </div>
                  <div>
                    <h5 className="font-mori font-semibold text-lg md:text-xl mb-1 text-moss-100">
                      {card.title}
                    </h5>
                    <p className="text-moss-100 text-base">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[40vh]"></div>
        </div>

        {/* Pinned image on the right */}
        <div
          className="md:sticky md:top-[calc((100vh+59px)/2)] md:-translate-y-1/2 h-fit w-full md:w-auto"
          style={{ zIndex: 10 }}
        >
          <div className="bg-moss-500 rounded-lg px-12 py-12">
            <div className="overflow-hidden w-full flex justify-center">
              <img
                id="position2"
                src="/img/coordination-globe-graphic.svg"
                width="400"
                height="396"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export function HomePage() {
  const navigate = useNavigate();

  const handleImageClick = (fullUrl: string) => {
    // Check if it's an external URL
    if (fullUrl.startsWith("http://") || fullUrl.startsWith("https://")) {
      window.location.href = fullUrl;
    } else {
      // Use React Router for internal navigation
      navigate(fullUrl);
    }
  };

  const scrollToAlignmentIssues = () => {
    document.getElementById("alignment-issues")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen relative">
      <ScrollBackground />
      <ScrollImageTransition />
      <StickyHeader />
      {/* hero */}
      <div>
        <section className="relative h-screen">
          {/* hero p5 animation - background */}
          <div className="absolute inset-0">
            <HeroAnimation />
          </div>
          {/* hero content - foreground */}
          <div className="absolute inset-0 z-10 flex items-end pb-10 md:pb-20 px-5 md:px-20">
            <div>
              <h1 className="text-lichen-500 text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 md:mb-12 font-mori max-w-[15ch]">
                <ScrambleText delay={500}>
                  Solving Alignment with Ethereum
                </ScrambleText>
              </h1>
              <div className="flex flex-wrap gap-3 md:gap-5">
                <a
                  href="https://www.dropbox.com/scl/fi/2ew20lb31kz62cd87g3dc/Owocki-Scheling-Point_Nov102025-b.pdf?rlkey=pw1jgsemym4tu34hol8egnt0y&e=1&st=636ugx92&dl=0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="uppercase" hoverAnimation size="m">
                    Read the Rainbow Paper
                  </Button>
                </a>
                <Button
                  className="uppercase"
                  hoverAnimation
                  size="m"
                  variant="tertiary"
                  onClick={scrollToAlignmentIssues}
                >
                  View common alignment issues
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative min-h-[100vh] md:min-h-[120vh] py-10 md:pt-20 px-5 md:px-20">
          <div className="relative mt-16 w-fit mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-start justify-center text-moon-300">
            <h2 className="absolute -top-[80px] left-0 mb-8 md:mb-12 text-moss-100 font-mori font-semibold text-2xl sm:text-4xl md:text-5xl w-full">
              What is a Multipolar trap?
            </h2>

            <div className="max-w-sm flex flex-col gap-12 md:gap-[20vh] md:pb-60">
              <AnimatedParagraph className="text-lg" delay={0}>
                A Multipolar trap is a particularly important type of alignment
                issue. It occurs when{" "}
                <span className="text-nectar-500 font-bold">
                  individual rational actions
                </span>{" "}
                lead to{" "}
                <span className="text-nectar-500 font-bold">
                  collectively worse outcomes
                </span>{" "}
                because no single actor can afford to unilaterally cooperate.
              </AnimatedParagraph>
              <AnimatedParagraph className="text-lg" delay={0.1}>
                Think of it like a race to the bottom: each actor follows the
                steepest incentive gradient toward local optimization, but these
                individual "rational" choices compound into a globally
                suboptimal equilibrium that traps everyone.
              </AnimatedParagraph>
              <AnimatedParagraph
                className="text-nectar-500 font-semibold text-2xl md:text-3xl"
                delay={0.2}
              >
                "A multipolar trap is when no one can unilaterally fix a
                problem—but together, they could."
              </AnimatedParagraph>
            </div>

            <div className="md:sticky md:top-1/2 md:-translate-y-1/2 md:mt-12 h-fit w-full md:w-auto">
              <img src="/img/trap.svg" width="914" height="392" />
            </div>
          </div>
        </section>

        <div id="alignment-issues">
          <AlignmentIssuesSection />
        </div>
      </div>

      <div
        className="py-16 md:py-32 flex flex-col gap-8 md:gap-20"
        id="bg-transition-point"
      >
        <section className="relative min-h-[100vh] md:min-h-[200vh] flex flex-col md:flex-row items-start justify-center gap-8 md:gap-16 px-5 md:px-20">
          <div className="md:sticky md:top-20 h-fit w-full md:w-auto">
            <h2 className="text-moss-500 font-semibold sm:text-left text-center sm:mx-none mx-auto text-3xl sm:text-4xl md:text-5xl font-mori max-w-[13ch] mb-8 md:mb-12">
              The Coordination Toolkit We Need
            </h2>
            <div className="overflow-hidden w-full flex justify-center">
              <img
                id="position1"
                src="/img/coordination-globe-graphic.svg"
                width="400"
                height="396"
              />
            </div>
          </div>

          <div className="flex flex-col gap-20 md:gap-40 max-w-full md:max-w-[360px] md:pt-20 w-full ml-1">
            {coordination.map((item, index) => (
              <AnimatedCoordinationCard
                key={item.name}
                item={item}
                index={index}
              />
            ))}
          </div>
        </section>

        <NetworkedCoordinationSection />

        <section>
          <div className="mx-2 sm:mx-16">
            <div className="max-w-[1060px] md:h-[440px] mx-auto md:p-8 p-4 relative mb-24 border border-moss-500 rounded-2xl">
              <div className="md:absolute md:mb-0 mb-4 border border-moss-500 rounded-2xl -top-9 md:-bottom-9 -left-12 flex items-center justify-center md:justify-end p-2 md:pl-16">
                <p className="text-moss-500 font-semibold font-mori text-2xl sm:text-3xl md:text-5xl md:max-w-[10ch]">
                  Ethereum Is More Than Money - It's a Coordination Engine
                </p>
              </div>
              <div className="md:absolute border border-moss-500 rounded-2xl top-1/2 md:-translate-y-1/2 -right-12 py-12 pl-2 pr-2 md:pl-6 md:pr-20 flex items-center">
                <div className="text-moon-900 font-medium text-base md:text-lg text-left flex flex-col gap-4">
                  <p>✓ Transparent, shared ledgers (no hidden info)</p>
                  <p>✓ Smart contracts (credible commitments) </p>
                  <p>✓ DAOs give us shared decision-making</p>
                  <p>✓ Public goods funding (RetroPGF, Gitcoin, Allo) </p>
                  <p>✓ Trustless enforcement (code = law) </p>
                  <p>✓ Anyone can build on it</p>
                </div>
              </div>

              <GridLayersParallax />
            </div>
          </div>
        </section>
      </div>

      <div>
        <TrapsSection />
      </div>

      {/* CTA */}
      <section className="relative h-screen ">
        {/* hero p5 animation - background */}
        <div className="absolute inset-0">
          <HeroAnimation />
        </div>
        {/* hero content - foreground */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 sm:gap-8 md:gap-12 p-4">
          <h1 className="text-moss-100 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mori font-semibold text-center">
            Are you in?
          </h1>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <a
              href="https://www.dropbox.com/scl/fi/2ew20lb31kz62cd87g3dc/Owocki-Scheling-Point_Nov102025-b.pdf?rlkey=pw1jgsemym4tu34hol8egnt0y&e=1&st=636ugx92&dl=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button hoverAnimation className="uppercase" size="m">
                Read the Rainbow Paper
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-moss-900 min-h-screen py-10 md:py-20 px-4 md:px-20">
        <div className="text-moss-100 flex flex-col justify-center items-center w-fit mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mori font-semibold max-w-[22ch] text-center mb-12 md:mb-12">
            Explore the Dynamics Behind Multipolar Traps, Visually
          </h2>
          <div className="max-w-[39rem] leading-relaxed border border-moss-100/40 rounded-3xl px-2 sm:px-5 py-8">
            <p className="mb-2">
              These artifacts help us conceptualize Multipolar Traps visually,
              making it easier to grok the system dynamics.
            </p>
            <p>
              Each shows a 3D landscape that represents possible futures within
              a “design space.”
            </p>

            <ul className="mb-8">
              <li>
                1. The flat grid is the space of choices or designs humans can
                make.
              </li>
              <li>
                2. The height (z-axis) represents the overall success of the
                system.
              </li>
            </ul>
            <p>
              These are maps of possibilities. Some design choices lift the
              world toward better outcomes, others sink it into breakdown. The
              goal is to climb the ridge toward the peak rather than slide into
              the valley of collapse.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <div className="grid [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] gap-8 sm:p-10 max-w-[1400px] mx-auto">
            {galleryData.featuredImages.map((item: GalleryItem) => (
              <div
                key={item.id}
                onClick={() => handleImageClick(item.fullUrl)}
                className="group bg-moss-500 rounded-xl overflow-hidden cursor-pointer border border-moss-100/40
                  transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="relative w-full pb-[75%] bg-moss-900 overflow-hidden">
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    loading="lazy"
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ease-out
                    group-hover:scale-105
                  "
                  />

                  {/* Overlay */}
                  {item.id !== "create-new" && (
                    <div
                      className="absolute inset-0 bg-black/70 flex items-center justify-center
                      opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100
                    "
                    >
                      <span className="text-moss-100 text-lg font-semibold">
                        View Visualization
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-moss-100 m-0">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/*
 * OLD CONTENT - COMMENTED OUT FOR REFERENCE
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.navLogo}>
            <span style={styles.logoText}>&nbsp;</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#about" style={styles.navLink}>About</a>
            <a href="#examples" style={styles.navLink}>Examples</a>
            <a href="#solution" style={styles.navLink}>Solutions</a>
            <a href="#visualizations" style={styles.navLink}>Visualizations</a>
          </div>
        </div>
      </nav>

      <header style={styles.header}>
        <div style={styles.mainHero}>
          <h1 style={styles.mainTitle}>Solving Multipolar Traps with Ethereum (for fun & profit)</h1>
          <p style={styles.mainSubtitle} className="main-subtitle">an exploration of the profound implications of programmable money as a tool to solve Multipolar traps...made w/ &gt;3 by ya boiiii <a href="https://x.com/owocki">@owocki</a></p>
        </div>

        <div style={styles.landingSection} id="about">
          <h2 style={styles.landingHeadline}>What is a Multipolar trap?</h2>
              <p style={styles.landingSubheadline}>
                A <strong>Multipolar trap</strong> occurs when individual rational actions lead to collectively worse outcomes because no single actor can afford to unilaterally cooperate.
              </p>
              <p style={styles.landingSubheadline}>
                Think of it like a race to the bottom: each actor follows the steepest incentive gradient toward local optimization, but these individual "rational" choices compound into a globally suboptimal equilibrium that traps everyone.
              </p>
          <div style={styles.tldrBox}>
            <p style={styles.tldrText}>
              "A multipolar trap is when no one can unilaterally fix a problem—but together, they could."
            </p>
          </div>
        </div>

        <div style={styles.landingSection} id="examples">
          <div style={styles.sectionHeaderWithButton}>
            <h2 style={styles.sectionHeading}>Multipolar traps are why can't we have nice things:</h2>
            <button
              onClick={() => setShowMoreExamples(!showMoreExamples)}
              style={styles.viewMoreButton}
            >
              {showMoreExamples ? 'View Less' : 'View More'}
            </button>
          </div>

          <div style={styles.trapExamplesGrid}>
            <div style={styles.trapExampleCard} className="trap-example-card">
              <div style={styles.trapExampleBadge}>🌍</div>
              <p style={styles.trapExampleText}><strong>Climate change:</strong> Everyone pollutes → Earth suffers</p>
            </div>
            <div style={styles.trapExampleCard} className="trap-example-card">
              <div style={styles.trapExampleBadge}>🐟</div>
              <p style={styles.trapExampleText}><strong>Overfishing:</strong> Everyone takes more → Fish go extinct</p>
            </div>
            <div style={styles.trapExampleCard} className="trap-example-card">
              <div style={styles.trapExampleBadge}>🤖</div>
              <p style={styles.trapExampleText}><strong>AI arms race:</strong> Every lab rushes ahead → Global risk increases</p>
            </div>

            {showMoreExamples && (
              <>
                <div style={styles.trapExampleCard} className="trap-example-card">
                  <div style={styles.trapExampleBadge}>🏭</div>
                  <p style={styles.trapExampleText}><strong>Tragedy of the Commons:</strong> Shared resources depleted by individual use</p>
                </div>
                <div style={styles.trapExampleCard} className="trap-example-card">
                  <div style={styles.trapExampleBadge}>🏠</div>
                  <p style={styles.trapExampleText}><strong>Housing crisis:</strong> Everyone buys property as investment → Prices unaffordable</p>
                </div>
                <div style={styles.trapExampleCard} className="trap-example-card">
                  <div style={styles.trapExampleBadge}>📱</div>
                  <p style={styles.trapExampleText}><strong>Attention economy:</strong> Platforms maximize engagement → Mental health crisis</p>
                </div>
                <div style={styles.trapExampleCard} className="trap-example-card">
                  <div style={styles.trapExampleBadge}>⚔️</div>
                  <p style={styles.trapExampleText}><strong>Nuclear arms race:</strong> Nations stockpile weapons → Existential risk for all</p>
                </div>
                <div style={styles.trapExampleCard} className="trap-example-card">
                  <div style={styles.trapExampleBadge}>💉</div>
                  <p style={styles.trapExampleText}><strong>Doping in sports:</strong> Athletes cheat to compete → Everyone must cheat to keep up</p>
                </div>
                <div style={styles.trapExampleCard} className="trap-example-card">
                  <div style={styles.trapExampleBadge}>🎓</div>
                  <p style={styles.trapExampleText}><strong>Education arms race:</strong> Students pile on credentials → Degree inflation</p>
                </div>
                <div style={styles.trapExampleCard} className="trap-example-card">
                  <div style={styles.trapExampleBadge}>🏢</div>
                  <p style={styles.trapExampleText}><strong>Corporate lobbying:</strong> Companies buy influence → Democracy eroded</p>
                </div>
                <div style={styles.trapExampleCard} className="trap-example-card">
                  <div style={styles.trapExampleBadge}>💊</div>
                  <p style={styles.trapExampleText}><strong>Antibiotic overuse:</strong> Doctors overprescribe → Drug-resistant bacteria</p>
                </div>
                <div style={styles.trapExampleCard} className="trap-example-card">
                  <div style={styles.trapExampleBadge}>🚗</div>
                  <p style={styles.trapExampleText}><strong>Traffic congestion:</strong> Everyone drives alone → Roads gridlocked</p>
                </div>
              </>
            )}
          </div>

        </div>

        <div style={styles.landingSection}>
          <h2 style={styles.sectionHeading}>Why Don't We Just Work Together?</h2>
          <p style={styles.coordinationText}>
            Incentives are misaligned. Trust is expensive. Enforcement is hard & states are bad at it and in some places, are corrupt.
          </p>

          <div style={styles.coordinationBreakdown}>
            <h2 style={styles.sectionHeading}>The Coordination Toolkit We Need</h2>
            <p style={styles.coordinationText}>
              We need systems that help groups <strong>see</strong>, <strong>coordinate</strong>, and <strong>commit</strong>:
            </p>

            <div style={styles.coordinationStepsGrid}>
              <div style={styles.coordinationStep}>
                <div style={styles.stepNumber}>1</div>
                <div style={styles.stepContent}>
                  <h4 style={styles.stepTitle}>See</h4>
                  <p style={styles.stepText}>
                    Shared visibility into the problem. Everyone needs to see the same truth - the state of the commons, the actions of others, and the consequences of inaction.
                  </p>
                </div>
              </div>

              <div style={styles.coordinationStep}>
                <div style={styles.stepNumber}>2</div>
                <div style={styles.stepContent}>
                  <h4 style={styles.stepTitle}>Coordinate</h4>
                  <p style={styles.stepText}>
                    Communicate and align on shared goals. Networks of bottom-up, peer-to-peer people can self-organize if they have the right tools to signal intentions and build consensus.
                  </p>
                </div>
              </div>

              <div style={styles.coordinationStep}>
                <div style={styles.stepNumber}>3</div>
                <div style={styles.stepContent}>
                  <h4 style={styles.stepTitle}>Commit</h4>
                  <p style={styles.stepText}>
                    Make credible, enforceable commitments. Without a way to lock in cooperation, the temptation to defect always wins. We need mechanisms that make cooperation the rational choice.
                  </p>
                </div>
              </div>
            </div>

            <div style={styles.bottomUpBox}>
              <h4 style={styles.bottomUpTitle}>💡 The Power of Networked Coordination</h4>
              <p style={styles.bottomUpText}>
                Top-down institutions are slow, captured, or corrupt. But networks of ordinary people—citizens, developers, communities—can coordinate at scale if given the right infrastructure.
              </p>
              <p style={styles.bottomUpText}>
                Peer-to-peer networks don't need permission. They don't need central authorities. They just need:
              </p>
              <ul style={styles.bottomUpList}>
                <li style={styles.bottomUpListItem}>✓ <strong>Transparency</strong> to see what's happening</li>
                <li style={styles.bottomUpListItem}>✓ <strong>Communication channels</strong> to align on goals</li>
                <li style={styles.bottomUpListItem}>✓ <strong>Commitment devices</strong> to lock in cooperation</li>
                <li style={styles.bottomUpListItem}>✓ <strong>Incentive alignment</strong> to reward collective action</li>
              </ul>
              <p style={styles.bottomUpText}>
                When these pieces come together, bottom-up coordination becomes possible—and powerful enough to diffuse multipolar traps.
              </p>
            </div>
          </div>
        </div>

        <div style={styles.landingSection} id="solution">
          <h2 style={styles.sectionHeading}>Ethereum Is More Than Money—It's a Coordination Engine</h2>

          <div style={styles.featuresGrid}>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✅</span>
              <span style={styles.featureText}>Transparent, shared ledgers (no hidden info)</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✅</span>
              <span style={styles.featureText}>Smart contracts (credible commitments)</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✅</span>
              <span style={styles.featureText}>DAOs give us shared decision-making</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✅</span>
              <span style={styles.featureText}>Public goods funding (RetroPGF, Gitcoin, Allo)</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✅</span>
              <span style={styles.featureText}>Trustless enforcement (code = law)</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✅</span>
              <span style={styles.featureText}>Anyone can build on it</span>
            </div>
          </div>
        </div>

        <div style={styles.landingSection}>
          <h2 style={styles.sectionHeading}>Multipolar Trap → Ethereum Solution</h2>
          <p style={styles.coordinationText}>
            Hover over each solution to learn how it works
          </p>

          <div style={styles.solutionsTable}>
            {solutionDetails.map((solution, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredSolution(index)}
                onMouseLeave={() => setHoveredSolution(null)}
              >
                <div
                  style={styles.solutionRow}
                  className="solution-row"
                >
                  <div style={styles.solutionProblem}>{solution.problem}</div>
                  <div style={styles.solutionArrow}>→</div>
                  <div style={styles.solutionTool}>{solution.tool}</div>
                  <div style={styles.solutionArrow}>→</div>
                  <div style={styles.solutionOutcome}>{solution.outcome}</div>
                </div>
                {hoveredSolution === index && (
                  <div style={styles.solutionDetails} className="solution-details">
                    <p style={styles.solutionDetailsText}>{solution.details}</p>
                    <div style={styles.projectsList}>
                      <h5 style={styles.projectsHeading}>Projects working on this:</h5>
                      <div style={styles.projectsGrid}>
                        {solution.projects.map((project, pIndex) => (
                          <a
                            key={pIndex}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.projectLink}
                            className="project-link"
                          >
                            {project.name} →
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.landingSection}>
          <h2 style={styles.sectionHeading}>In Ethereum, We're Building the Tools to Disarm These Traps</h2>
          <p style={styles.joinSubheading}>Are you in?</p>

          <div style={styles.ctaButtonsGrid}>
            <button
              onClick={() => window.open('https://ethereum.org/en/community/grants/', '_blank')}
              style={styles.ctaButton}
            >
              Learn More about Ethereum Coordination Ecosystem
            </button>
            <button
              onClick={() => window.open('https://gitcoin.co/', '_blank')}
              style={styles.ctaButton}
            >
              Support Ethereum Coordination Tech
            </button>
            <button
              onClick={() => window.open('https://ethereumlocalism.xyz/', '_blank')}
              style={styles.ctaButton}
            >
              Get involved locally
            </button>
          </div>
        </div>

        <div style={styles.papersSection}>
          <h3 style={styles.papersSectionHeading}>Learn More About Solving Multipolar Traps with Ethereum</h3>
          <div style={styles.papersGrid}>
            <button
              onClick={() => window.open('https://www.gitcoin.co/vision', '_blank')}
              style={styles.paperButton}
              className="paper-button"
            >
              <div style={styles.paperIcon}>📄</div>
              <div style={styles.paperContent}>
                <div style={styles.paperTitle}>Gitcoin Vision Paper</div>
                <div style={styles.paperSubtitle}>Our vision for coordination technology</div>
              </div>
            </button>
            <button
              onClick={() => window.open('https://www.gitcoin.co/whitepaper', '_blank')}
              style={styles.paperButton}
              className="paper-button"
            >
              <div style={styles.paperIcon}>📋</div>
              <div style={styles.paperContent}>
                <div style={styles.paperTitle}>Gitcoin Whitepaper</div>
                <div style={styles.paperSubtitle}>Technical implementation details</div>
              </div>
            </button>
          </div>
        </div>

          <h3 style={styles.ctaHeading}>Explore the Dynamics Behind Multipolar Traps, Visually</h3>
          <p style={styles.tldrText}>
            These artifacts help us conceptualize Multipolar Traps visually, making it easier to grok the system dynamics.
          </p>
          <p style={styles.tldrText}>
            Each shows a 3D landscape that represents possible futures within a “design space.” The flat grid is the space of choices or designs humans can make. The height (z-axis) represents the overall success of the system. 
          </p>

          <p style={styles.tldrText}>
These are maps of possibilities. Some design choices lift the world toward better outcomes, others sink it into breakdown. The goal is to climb the ridge toward the peak rather than slide into the valley of collapse.
          </p>
        </div>
      </header>

      <div style={styles.gallery}>
        {galleryData.featuredImages.map((item: GalleryItem) => (
          <div
            key={item.id}
            style={styles.card}
            onClick={() => handleImageClick(item.fullUrl)}
          >
            <div style={styles.imageContainer}>
              <img
                src={item.previewUrl}
                alt={item.title}
                style={styles.image}
                loading="lazy"
              />
              <div style={styles.overlay}>
                <span style={styles.viewText}>View Visualization</span>
              </div>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
*/
