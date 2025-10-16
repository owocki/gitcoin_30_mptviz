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

  const handleImageClick = (fullUrl: string) => {
    window.location.href = fullUrl;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>



        {/* Main Hero Section */}
        <div style={styles.mainHero}>
          <h1 style={styles.mainTitle}>Solving Multipolar Traps with Ethereum</h1>
          <p style={styles.mainSubtitle}>an exploration of the profound implications of programmable money as a tool to solve Multipolar traps...made w/ &gt;3 by ya boiiii <a href="https://x.com/owocki">@owocki</a></p>
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
            Incentives are misaligned. Trust is expensive. Enforcement is hard & states are bad at it and in some places, are corrupt.<br/>
            We need systems that help groups <strong>see</strong>, <strong>coordinate</strong>, and <strong>commit</strong>.
          </p>
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

          <div style={styles.solutionsTable}>
            <div style={styles.solutionRow}>
              <div style={styles.solutionProblem}>Climate inaction</div>
              <div style={styles.solutionArrow}>→</div>
              <div style={styles.solutionTool}>Tokenized carbon credits</div>
              <div style={styles.solutionArrow}>→</div>
              <div style={styles.solutionOutcome}>Verified action, shared cost</div>
            </div>
            <div style={styles.solutionRow}>
              <div style={styles.solutionProblem}>AI arms race</div>
              <div style={styles.solutionArrow}>→</div>
              <div style={styles.solutionTool}>Open models + attestations</div>
              <div style={styles.solutionArrow}>→</div>
              <div style={styles.solutionOutcome}>Shared safety incentives</div>
            </div>
            <div style={styles.solutionRow}>
              <div style={styles.solutionProblem}>Public goods underfunding</div>
              <div style={styles.solutionArrow}>→</div>
              <div style={styles.solutionTool}>Quadratic Funding</div>
              <div style={styles.solutionArrow}>→</div>
              <div style={styles.solutionOutcome}>Fairer shared contribution</div>
            </div>
            <div style={styles.solutionRow}>
              <div style={styles.solutionProblem}>Misinformation</div>
              <div style={styles.solutionArrow}>→</div>
              <div style={styles.solutionTool}>Reputation + attestations</div>
              <div style={styles.solutionArrow}>→</div>
              <div style={styles.solutionOutcome}>Credibility over virality</div>
            </div>
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
