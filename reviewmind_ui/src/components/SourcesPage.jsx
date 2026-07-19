import styles from '../styles/SourcesPage.module.css';
import EmptyState from './EmptyState';

export default function SourcesPage({ totalReviews }) {
  if (totalReviews === 0) {
    return (
      <div className={styles.card}>
        <EmptyState 
          icon="sources" 
          title="No source data yet" 
          description="Once reviews are processed, we'll show where they came from — Play Store, App Store, Trustpilot, etc." 
        />
      </div>
    );
  }

  // Jab data aayega, yeh list render hogi
  const sources = [
    { name: 'Google Play Store', count: 0, color: '#2A9D8F' },
    { name: 'App Store', count: 0, color: '#E9A23B' },
    { name: 'Trustpilot', count: 0, color: '#6366F1' },
    { name: 'Direct Feedback', count: 0, color: '#D4654A' },
  ];

  return (
    <div className={styles.card}>
      <p className={styles.title}>Review sources</p>
      <div className={styles.list}>
        {sources.map((s, i) => (
          <div key={i} className={styles.row}>
            <div className={styles.dot} style={{ background: s.color }} />
            <span className={styles.name}>{s.name}</span>
            <span className={styles.count}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}