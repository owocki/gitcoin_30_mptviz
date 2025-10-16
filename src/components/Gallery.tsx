import React from 'react';
import galleryData from '../config/gallery.json';

interface GalleryItem {
  id: string;
  title: string;
  previewUrl: string;
  fullUrl: string;
}

export function Gallery() {
  const handleImageClick = (fullUrl: string) => {
    window.location.href = fullUrl;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Multi-Polar Traps (MPT) - a new frontier</h1>

        {/* Hero Section with Explanation */}
        <div style={styles.heroSection}>
          <div style={styles.heroContent} className="hero-content">
            <div style={styles.heroText}>
              <h2 style={styles.heroHeading}>What is a Multi-Polar Trap?</h2>
              <p style={styles.heroDescription}>
                A <strong>multi-polar trap</strong> occurs when individual rational actions lead to collectively worse outcomes because no single actor can afford to unilaterally cooperate.
              </p>
              <p style={styles.heroDescription}>
                Think of it like a race to the bottom: each actor follows the steepest incentive gradient toward local optimization, but these individual "rational" choices compound into a globally suboptimal equilibrium that traps everyone.
              </p>
              <p style={styles.heroDescription}>
                This visualizer models MPTs as <strong>incentive gradients</strong>: actors follow the steepest path toward local attractors, getting trapped in suboptimal equilibria.
              </p>
            </div>

            <div style={styles.examplesGrid}>
              <div style={styles.exampleCard} className="example-card">
                <div style={styles.exampleHeader}>
                  <div style={styles.exampleIcon}>🏭</div>
                  <h3 style={styles.exampleTitle}>Example 1: Tragedy of the Commons</h3>
                </div>
                <p style={styles.exampleText}>Individual farmers overgraze shared land, depleting resources for all</p>
              </div>
              <div style={styles.exampleCard} className="example-card">
                <div style={styles.exampleHeader}>
                  <div style={styles.exampleIcon}>⚔️</div>
                  <h3 style={styles.exampleTitle}>Example 2: Arms Race</h3>
                </div>
                <p style={styles.exampleText}>Nations stockpile weapons for security, making everyone less safe</p>
              </div>
              <div style={styles.exampleCard} className="example-card">
                <div style={styles.exampleHeader}>
                  <div style={styles.exampleIcon}>📱</div>
                  <h3 style={styles.exampleTitle}>Example 3: Attention Economy</h3>
                </div>
                <p style={styles.exampleText}>Platforms optimize for engagement, degrading collective well-being</p>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.ctaSection}>
          <h3 style={styles.ctaHeading}>Explore the Dynamics</h3>
          <p style={styles.ctaText}>
            Browse featured visualizations below or create your own custom multi-polar trap scenario
          </p>
          <button
            onClick={() => window.location.hash = 'create'}
            style={styles.createButton}
          >
            Create New Visualization
          </button>
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
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
  },
  header: {
    textAlign: 'center',
    padding: '60px 20px 40px',
    backgroundColor: '#1a1d23',
    borderBottom: '1px solid #3a3d45',
  },
  title: {
    fontSize: '42px',
    fontWeight: 700,
    margin: '0 0 40px 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSection: {
    maxWidth: '1200px',
    margin: '0 auto 60px',
    padding: '40px 20px',
  },
  heroContent: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '60px',
    alignItems: 'start',
  },
  heroText: {
    textAlign: 'left',
  },
  heroHeading: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '20px',
    marginTop: 0,
  },
  heroDescription: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#d1d5db',
    marginBottom: '16px',
    textAlign: 'left',
  },
  examplesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
  },
  exampleCard: {
    backgroundColor: '#0f1114',
    border: '1px solid #3a3d45',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'left',
    transition: 'border-color 0.3s ease',
  },
  exampleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  exampleIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  exampleTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
  },
  exampleText: {
    fontSize: '14px',
    color: '#a8adb7',
    margin: 0,
    lineHeight: '1.5',
  },
  ctaSection: {
    marginTop: '40px',
  },
  ctaHeading: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 12px 0',
  },
  ctaText: {
    fontSize: '16px',
    color: '#a8adb7',
    margin: '0 0 24px 0',
  },
  createButton: {
    padding: '12px 32px',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
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
    .create-button:hover {
      background-color: #218838 !important;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
    }
    .example-card:hover {
      border-color: #667eea !important;
    }

    /* Responsive design for hero section */
    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr !important;
        gap: 40px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
