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
        <h1 style={styles.title}>Multi-Polar Traps (MPT) Visualizer</h1>
        <h2 style={styles.subtitle}>a situation where individual rational actions lead to collectively worse outcomes because no single actor can afford to unilaterally cooperate.
        </h2>
        <p style={styles.subtitle}>This visualizer conceptualizes a multipolar trap as incentive gradients: local self-interest pulls actors into valleys that degrade the global outcome.        </p>
        <p style={styles.subtitle}>
          Explore featured visualizations of MPTs or create your own</p>
        <button
          onClick={() => window.location.hash = 'create'}
          style={styles.createButton}
        >
          Create New Visualization
        </button>
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
    minHeight: '100vh',
    backgroundColor: '#0f1114',
    color: '#fff',
    overflow: 'auto',
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
    margin: '0 0 10px 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '18px',
    color: '#a8adb7',
    margin: '0 0 30px 0',
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
  `;
  document.head.appendChild(styleSheet);
}
