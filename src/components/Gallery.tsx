import React from 'react';
import galleryData from '../config/gallery.json';

interface GalleryItem {
  id: string;
  title: string;
  previewUrl: string;
  fullUrl: string;
}

export function Gallery() {
  const [showMoreExamples, setShowMoreExamples] = React.useState(false);
  const [hoveredSolution, setHoveredSolution] = React.useState<number | null>(null);

  const handleImageClick = (fullUrl: string) => {
    window.location.href = fullUrl;
  };

  const solutionDetails = [
    {
      problem: "Climate inaction",
      tool: "Tokenized carbon credits",
      outcome: "Verified action, shared cost",
      details: "Carbon credits are tokenized on-chain, making emissions reduction transparent and tradeable. Communities can pool funds to buy and retire credits. Smart contracts automatically verify and reward climate-positive actions. Everyone can see who's contributing, creating social and economic incentives to participate.",
      projects: [
        { name: "Toucan Protocol", url: "https://toucan.earth/" },
        { name: "KlimaDAO", url: "https://www.klimadao.finance/" },
        { name: "Regen Network", url: "https://www.regen.network/" }
      ]
    },
    {
      problem: "AI arms race",
      tool: "Open models + attestations",
      outcome: "Shared safety incentives",
      details: "AI development becomes transparent through on-chain attestations. Teams commit to safety protocols via smart contracts. Open-source models with verified safety checks get funding through quadratic mechanisms. Whistleblowers can anonymously report violations. The race becomes who can build the safest AI, not just the fastest.",
      projects: [
        { name: "Bittensor", url: "https://bittensor.com/" },
        { name: "Theoriq", url: "https://www.theoriq.ai/" },
        { name: "Ocean Protocol", url: "https://oceanprotocol.com/" }
      ]
    },
    {
      problem: "Public goods underfunding",
      tool: "Quadratic Funding",
      outcome: "Fairer shared contribution",
      details: "Small donors get matched by a larger funding pool, amplifying grassroots support. Projects valued by many people (not just whales) receive proportionally more funding. The community signals what matters through small contributions. This mechanism has already allocated millions to open-source software, research, and local communities.",
      projects: [
        { name: "Gitcoin Grants", url: "https://grants.gitcoin.co/" },
        { name: "Giveth", url: "https://giveth.io/" },
        { name: "clr.fund", url: "https://clr.fund/" },
        { name: "Optimism RetroPGF", url: "https://app.optimism.io/retropgf" }
      ]
    },
    {
      problem: "Misinformation",
      tool: "Reputation + attestations",
      outcome: "Credibility over virality",
      details: "Reputation systems built on verifiable credentials make trust portable and transparent. Attestations from credible sources are recorded on-chain. Users can verify claims independently without trusting platforms. Networks of trust emerge based on actual behavior, not engagement metrics. Lies become expensive; truth becomes profitable.",
      projects: [
        { name: "Ethereum Attestation Service", url: "https://attest.sh/" },
        { name: "Gitcoin Passport", url: "https://passport.gitcoin.co/" },
        { name: "Clique", url: "https://www.clique.social/" }
      ]
    }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>



        {/* Main Hero Section */}
        <div style={styles.mainHero}>
          <h1 style={styles.mainTitle}>Solving Multipolar Traps</h1>
          <h3 style={styles.mainTitle}>for fun & profit (with Ethereum)</h3>
          <p style={styles.mainSubtitle} className="main-subtitle">an exploration of the profound implications of programmable money as a tool to solve Multipolar traps...made w/ &gt;3 by ya boiiii <a href="https://x.com/owocki">@owocki</a></p>
        </div>

        {/* Hero Section: The Trap We're In */}
        <div style={styles.landingSection}>
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

        {/* Section 2: What is a Multipolar Trap? */}
        <div style={styles.landingSection}>
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

        {/* Section 3: The Coordination Problem */}
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
              <h4 style={styles.bottomUpTitle}>💡 The Power of Bottom-Up Coordination</h4>
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
                When these pieces come together, bottom-up coordination becomes possible—and powerful enough to escape multipolar traps.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Ethereum Is a Coordination Substrate */}
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

        {/* Section 5: Real-World Solutions */}
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

        {/* Section 6: Join the Coordinators */}
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

        {/* Explore Visualizations CTA */}
        <div style={styles.ctaSection}>
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
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    backgroundColor: '#0f1114',
    color: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  header: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#1a1d23',
    borderBottom: '1px solid #3a3d45',
  },
  mainHero: {
    padding: '40px 0 20px',
  },
  mainTitle: {
    fontSize: '48px',
    fontWeight: 700,
    margin: '0 0 10px 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  mainSubtitle: {
    fontSize: '18px',
    color: '#a8adb7',
    fontStyle: 'italic',
    margin: 0,
  },
  landingSection: {
    maxWidth: '1000px',
    margin: '60px auto',
    padding: '0 20px',
  },
  landingHeadline: {
    fontSize: '36px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '20px',
    lineHeight: '1.3',
  },
  landingSubheadline: {
    fontSize: '20px',
    color: '#d1d5db',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  primaryButton: {
    padding: '16px 40px',
    backgroundColor: '#667eea',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '18px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  sectionHeading: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '30px',
    lineHeight: '1.3',
  },
  sectionHeaderWithButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  viewMoreButton: {
    padding: '10px 24px',
    backgroundColor: 'transparent',
    border: '1px solid #667eea',
    borderRadius: '6px',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flexShrink: 0,
  },
  trapExamplesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    margin: '30px 0',
  },
  trapExampleCard: {
    backgroundColor: '#0f1114',
    border: '1px solid #3a3d45',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    transition: 'border-color 0.3s ease',
  },
  trapExampleBadge: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  trapExampleText: {
    fontSize: '16px',
    color: '#d1d5db',
    margin: 0,
    lineHeight: '1.5',
  },
  tldrBox: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    border: '2px solid #667eea',
    borderRadius: '12px',
    padding: '24px',
    margin: '30px 0',
  },
  tldrText: {
    fontSize: '20px',
    color: '#fff',
    fontStyle: 'italic',
    margin: 0,
    lineHeight: '1.6',
  },
  coordinationText: {
    fontSize: '18px',
    color: '#d1d5db',
    lineHeight: '1.7',
    margin: '20px 0',
  },
  coordinationBreakdown: {
    marginTop: '40px',
  },
  subSectionHeading: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '16px',
    marginTop: 0,
  },
  coordinationStepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    margin: '30px 0 40px',
  },
  coordinationStep: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 700,
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 8px 0',
  },
  stepText: {
    fontSize: '16px',
    color: '#d1d5db',
    lineHeight: '1.6',
    margin: 0,
  },
  bottomUpBox: {
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    border: '2px solid #667eea',
    borderRadius: '12px',
    padding: '30px',
    marginTop: '30px',
  },
  bottomUpTitle: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 16px 0',
  },
  bottomUpText: {
    fontSize: '16px',
    color: '#d1d5db',
    lineHeight: '1.7',
    margin: '0 0 16px 0',
  },
  bottomUpList: {
    listStyle: 'none',
    padding: 0,
    margin: '16px 0',
  },
  bottomUpListItem: {
    fontSize: '16px',
    color: '#d1d5db',
    lineHeight: '1.8',
    marginBottom: '8px',
    paddingLeft: '8px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    margin: '30px 0',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#0f1114',
    borderRadius: '8px',
    border: '1px solid #3a3d45',
  },
  featureIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  featureText: {
    fontSize: '16px',
    color: '#d1d5db',
    lineHeight: '1.5',
  },
  solutionsTable: {
    display: 'grid',
    gap: '20px',
    margin: '30px 0',
  },
  solutionRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr auto 1fr',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#0f1114',
    border: '1px solid #3a3d45',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  solutionProblem: {
    fontSize: '16px',
    color: '#fb923c',
    fontWeight: 600,
    textAlign: 'right',
  },
  solutionTool: {
    fontSize: '16px',
    color: '#667eea',
    fontWeight: 600,
    textAlign: 'center',
  },
  solutionOutcome: {
    fontSize: '16px',
    color: '#4ade80',
    fontWeight: 600,
    textAlign: 'left',
  },
  solutionArrow: {
    fontSize: '18px',
    color: '#a8adb7',
  },
  solutionDetails: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid #667eea',
    borderRadius: '0 0 12px 12px',
    padding: '20px',
    marginTop: '-12px',
    marginBottom: '20px',
    animation: 'slideDown 0.3s ease',
  },
  solutionDetailsText: {
    fontSize: '15px',
    color: '#d1d5db',
    lineHeight: '1.7',
    margin: '0 0 20px 0',
  },
  projectsList: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(102, 126, 234, 0.3)',
  },
  projectsHeading: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 12px 0',
  },
  projectsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  projectLink: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    border: '1px solid #667eea',
    borderRadius: '6px',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  joinSubheading: {
    fontSize: '24px',
    color: '#d1d5db',
    marginBottom: '30px',
    fontWeight: 600,
  },
  ctaButtonsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    margin: '30px 0',
  },
  ctaButton: {
    padding: '14px 28px',
    backgroundColor: '#3a3d45',
    border: '1px solid #667eea',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  ctaButtonPrimary: {
    padding: '14px 28px',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  ctaSection: {
    marginTop: '60px',
    paddingTop: '40px',
    borderTop: '2px solid #3a3d45',
  },
  ctaHeading: {
    fontSize: '28px',
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 12px 0',
  },
  ctaText: {
    fontSize: '18px',
    color: '#a8adb7',
    margin: '0 0 40px 0',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '30px',
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#1a1d23',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid #3a3d45',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '75%',
    backgroundColor: '#0f1114',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  viewText: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 600,
  },
  cardContent: {
    padding: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 600,
    margin: 0,
    color: '#fff',
  },
};

// Add hover effects via a style tag
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    /* Main subtitle link styling */
    .main-subtitle a {
      color: #ffffff;
      text-decoration: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      transition: border-color 0.3s ease;
    }

    .main-subtitle a:hover {
      border-bottom-color: #ffffff;
    }

    .gallery-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .gallery-card:hover .overlay {
      opacity: 1 !important;
    }
    .gallery-card:hover img {
      transform: scale(1.05);
    }

    /* Button hover effects */
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }

    /* View More button specific hover */
    button[style*="border: 1px solid rgb(102, 126, 234)"]:hover {
      background-color: rgba(102, 126, 234, 0.1) !important;
      border-color: #764ba2 !important;
    }

    /* Trap example cards hover */
    .trap-example-card:hover {
      border-color: #667eea !important;
      transform: translateY(-3px);
    }

    /* Solution row hover effects */
    .solution-row:hover {
      border-color: #667eea !important;
      transform: scale(1.02);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    /* Slide down animation for solution details */
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .solution-details {
      animation: slideDown 0.3s ease;
    }

    /* Project link hover effects */
    .project-link:hover {
      background-color: rgba(102, 126, 234, 0.4) !important;
      border-color: #764ba2 !important;
      color: #fff !important;
      transform: translateX(5px);
    }

    /* Responsive design for solution rows */
    @media (max-width: 768px) {
      .solution-row {
        grid-template-columns: 1fr !important;
        text-align: center !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
