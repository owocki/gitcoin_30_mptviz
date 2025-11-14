import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { HeroAnimation } from "../components/HeroAnimation";
import EarthGraphic from "../components/EarthGraphic";

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

const CoordinationCard = ({
  name,
  description,
  index,
}: {
  name: string;
  description: string;
  index: number;
}) => {
  return (
    <div className="pr-4 py-6 pl-8 md:pl-12 bg-lichen-100 border border-moss-500/25 rounded-lg relative">
      <h4 className="text-moss-500 font-semibold text-xl sm:text-2xl font-mori mb-2">
        {name}
      </h4>
      <p className="text-moon-900">{description}</p>

      <div className="absolute top-1/2 -translate-x-1/2 left-0 -translate-y-1/2">
        <div className="md:size-16 size-10 flex items-center justify-center text-3xl md:text-4xl bg-lichen-100 border border-moss-500/25 rounded-full">
          {index + 1}
        </div>
      </div>
    </div>
  );
};

const CardWithBorder = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-md py-4 px-5 text-moss-500 border border-moss-500 font-mori font-semibold text-4xl sm:text-5xl
        ${className}`}
  >
    {children}
  </div>
);

const TrapsSection = () => {
  const traps = [
    {
      steps: [
        "Misinformation",
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
        "Reputation systems built on verifiable credentials make trust portable and transparent. Attestations from credible sources are recorded on-chain. Users can verify claims independently without trusting platforms. Networks of trust emerge based on actual behavior, not engagement metrics. Lies become expensive; truth becomes profitable.",
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
      steps: [
        "Public goods underfunding",
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

  return (
    <section className="">
      {traps.map((trap, i) => (
        <div
          key={i}
          className={`${trap.colors.bg} relative flex items-center justify-between py-10 gap-8 h-screen `}
        >
          <div className="w-full flex items-center justify-center flex-col">
            <div className="flex flex-col justify-start">
              <div
                className={`py-2 px-3 rounded-md ${trap.colors.lightBg} ${trap.colors.text} font-semibold w-fit mb-6`}
              >
                Multipolar Trap → Ethereum Solution
              </div>
              <p className="mb-6 flex items-center gap-2">
                {trap.steps.map((entry, stepIndex) => (
                  <div className="flex items-center gap-2 font-semibold text-xl md:text-xl">
                    <span>{entry}</span>
                    {stepIndex !== trap.steps.length - 1 && <RightArrow />}
                  </div>
                ))}
              </p>
              <p className="max-w-xl mb-12">{trap.description}</p>

              <div
                className={`w-fit flex items-center gap-2.5 flex-wrap px-4 py-2 rounded-2xl border ${trap.colors.border} ${trap.colors.text}`}
              >
                <span className="mr-4 leading-none">
                  Projects working on this
                </span>
                {trap.projects.map((entry) => (
                  <a href={entry.url} className="leading-none">
                    <Button
                      size="sm"
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
          <div className="flex-shrink-0">
            <EarthGraphic
              className={`max-h-[90vh] w-auto ${trap.colors.text}`}
            />
            {/* <img
              src="/img/earth.svg"
              width="413"
              height="735"
              className="max-h-[90vh] w-auto"
            /> */}
          </div>
        </div>
      ))}
    </section>
  );
};

export function HomePage() {
  const navigate = useNavigate();

  // const handleImageClick = (fullUrl: string) => {
  //   // Check if it's an external URL
  //   if (fullUrl.startsWith("http://") || fullUrl.startsWith("https://")) {
  //     window.location.href = fullUrl;
  //   } else {
  //     // Use React Router for internal navigation
  //     navigate(fullUrl);
  //   }
  // };

  return (
    <main className="min-h-screen">
      {/* hero */}
      <div className="bg-moss-900">
        <section className="relative h-screen">
          {/* hero p5 animation - background */}
          <div className="absolute inset-0">
            <HeroAnimation />
          </div>
          {/* hero content - foreground */}
          <div className="absolute inset-0 z-10 flex items-end pb-20 px-20">
            <div>
              <h1 className="text-lichen-500 text-4xl sm:text-6xl md:text-7xl mb-12 font-mori max-w-[15ch]">
                Solving Alignment with Ethereum
              </h1>
              <div className="flex flex-wrap gap-5">
                <a
                  href="https://www.gitcoin.co/vision"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>Gitcoin Vision Paper</Button>
                </a>
                <Button>Learn more</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-20">
          <h2 className="mb-12 text-moss-100 font-mori font-semibold text-3xl sm:text-5xl">
            What is a Multipolar trap?
          </h2>

          <div className="flex gap-12 items-center justify-center text-moon-300">
            <div className="max-w-sm flex flex-col gap-6">
              <p className="text-lg">
                A Multipolar trap occurs when{" "}
                <span className="text-nectar-500">
                  individual rational actions
                </span>{" "}
                lead to{" "}
                <span className="text-nectar-500">
                  collectively worse outcomes
                </span>{" "}
                because no single actor can afford to unilaterally cooperate.
              </p>
              <p className="text-lg">
                Think of it like a race to the bottom: each actor follows the
                steepest incentive gradient toward local optimization, but these
                individual "rational" choices compound into a globally
                suboptimal equilibrium that traps everyone.
              </p>
              <p className="text-nectar-500 font-semibold text-2xl md:text-3xl">
                "A multipolar trap is when no one can unilaterally fix a
                problem—but together, they could."
              </p>
            </div>

            <div>
              <img src="/img/trap.svg" width="914" height="392" />
            </div>
          </div>
        </section>

        <section className="py-20 px-20">
          <h2 className="mb-12 text-moss-100 font-mori font-semibold text-3xl sm:text-5xl text-center">
            Alignment issues
          </h2>
          <div>
            <div className="flex items-center justify-center">
              <img src="/img/trap.svg" width="914" height="392" />
            </div>
          </div>
        </section>
      </div>

      <div className="bg-moss-100 py-32 flex flex-col gap-16">
        <section className="flex items-center justify-center gap-16 ">
          <div>
            <h2 className="text-moss-500 font-semibold text-3xl sm:text-5xl font-mori max-w-[13ch] mb-12">
              The Coordination Toolkit We Need
            </h2>
            <img src="/img/coordination-globe-graphic.svg" width="400" height="396" />
          </div>

          <div className="flex flex-col gap-8 max-w-[360px]">
            {coordination.map((item, index) => (
              <CoordinationCard
                key={item.name}
                name={item.name}
                description={item.description}
                index={index}
              />
            ))}
          </div>
        </section>

        <section className="py-20 px-20 ">
          <div>
            <div className="relative h-[350px] max-w-5xl mb-12 ml-[20%]">
              <CardWithBorder className="absolute top-0 left-[50px]">
                The Power
              </CardWithBorder>
              <CardWithBorder className="absolute top-[60px] left-[300px]">
                of Networked
              </CardWithBorder>
              <CardWithBorder className="absolute top-[120px] left-0">
                Coordination
              </CardWithBorder>
            </div>
          </div>

          <div className="flex items-center justify-center gap-10">
            <div className="h-[450px] bg-moss-500 rounded-lg py-8 px-10 sm:px-14 text-moss-100 flex flex-col gap-9 max-w-[377px]">
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

            <div className="bg-moss-500 rounded-lg px-12">
              <img src="/img/power-graphic.svg" width="450" height="450" />
            </div>
          </div>
        </section>

        <section>
          <div className="">
            <div className="w-full max-w-[1060px] h-[440px] mx-auto relative border border-moss-500 rounded-2xl child:border child:border-moss-500 child:rounded-2xl">
              <div className="absolute -top-9 -bottom-9 -left-12 flex items-center justify-end p-2 pl-16">
                <p className="text-moss-500 font-semibold font-mori text-3xl md:text-5xl max-w-[10ch]">
                  Ethereum Is More Than Money - It's a Coordination Engine
                </p>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-12 py-10 pl-6 pr-20 flex items-center">
                <p className="text-moss-500 font-semibold text-base md:text-lg text-left leading-loose">
                  ✓ Transparent, shared ledgers (no hidden info) <br />
                  ✓ Smart contracts (credible commitments) <br />
                  ✓ DAOs give us shared decision-making <br />
                  ✓ Public goods funding (RetroPGF, Gitcoin, Allo) <br />✓
                  Trustless enforcement (code = law) <br />✓ Anyone can build on
                  it
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div>
        <TrapsSection />
      </div>

      {/* CTA */}
      <section className="relative h-screen">
        {/* hero p5 animation - background */}
        <div className="absolute inset-0">
          <HeroAnimation />
        </div>
        {/* hero content - foreground */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 sm:gap-12 md:gap-16 p-4">
          <h1 className="text-moss-100 text-3xl sm:text-4xl md:text-5xl font-mori font-semibold">
            Are you in?
          </h1>
          <div className="flex flex-wrap gap-8">
            <a
              href="https://www.gitcoin.co/vision"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Gitcoin Vision Paper</Button>
            </a>
            <a
              href="https://www.gitcoin.co/whitepaper"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Gitcoin Whitepaper</Button>
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 font-semibold max-w-lg text-moss-100">
            <a href="" target="_blank">
              &gt; Support Ethereum Coordination Tech
            </a>
            <a href="" target="_blank">
              &gt; Get involved locally
            </a>
            <a href="" target="_blank">
              &gt; Learn more about Ethereum Coordination Ecosystem
            </a>
          </div>
        </div>
      </section>

      <section className="bg-moss-900 min-h-screen py-20 px-20">
        <div className="text-moss-100">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mori font-semibold max-w-[25ch] mb-12">
            Explore the Dynamics Behind Multipolar Traps, Visually
          </h2>
          <div>
            <div className="max-w-[40rem]">
              <p>
                These artifacts help us conceptualize Multipolar Traps visually,
                making it easier to grok the system dynamics. <br />
                Each shows a 3D landscape that represents possible futures
                within a “design space.”
              </p>
              <ol className="list-decimal mb-6">
                <li>
                  The flat grid is the space of choices or designs humans can
                  make.
                </li>
                <li>
                  The height (z-axis) represents the overall success of the
                  system.
                </li>
              </ol>
              <p>
                These are maps of possibilities. Some design choices lift the
                world toward better outcomes, others sink it into breakdown. The
                goal is to climb the ridge toward the peak rather than slide
                into the valley of collapse.
              </p>
            </div>
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
