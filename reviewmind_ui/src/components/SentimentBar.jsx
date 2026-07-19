// PEHLE THA: import styles from './SentimentBar.module.css';
// AB YEH HOGA:
import styles from '../styles/SentimentBar.module.css';
import EmptyState from './EmptyState';

// ... baaki code same rahega
export default function SentimentBar({ totalReviews, negPct, neuPct, posPct, loading }) {
  if (!loading && totalReviews === 0) {
    return (
      <div className={styles.card}>
        <EmptyState icon="sentiment" title="No sentiment data yet" description="Upload a CSV and hit Refresh — we'll break down the mood of your reviews." />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <p className={styles.title}>Sentiment breakdown</p>
      <div className={styles.barBg}>
        {negPct > 0 && <div className={styles.barNeg} style={{ width: `${negPct}%` }} />}
        {neuPct > 0 && <div className={styles.barNeu} style={{ width: `${neuPct}%` }} />}
        {posPct > 0 && <div className={styles.barPos} style={{ width: `${posPct}%` }} />}
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotNeg}`}></span>Negative · {negPct}%</span>
        <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotNeu}`}></span>Neutral · {neuPct}%</span>
        <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotPos}`}></span>Positive · {posPct}%</span>
      </div>
    </div>
  );
}