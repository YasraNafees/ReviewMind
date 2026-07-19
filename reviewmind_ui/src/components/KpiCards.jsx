import styles from '../styles/KpiCards.module.css';

export default function KpiCards({ totalReviews, sentimentScore, negPct, loading }) {
  const val = loading ? '—' : null;
  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.cardDefault}`}>
        <p className={styles.label}>Reviews analyzed</p>
        <p className={`${styles.value} ${styles.textDefault}`}>{val || totalReviews.toLocaleString()}</p>
      </div>
      <div className={`${styles.card} ${styles.cardNeutral}`}>
        <p className={styles.label}>Sentiment score</p>
        <p className={`${styles.value} ${styles.textNeutral}`}>{val || `${sentimentScore}/100`}</p>
      </div>
      <div className={`${styles.card} ${styles.cardNegative}`}>
        <p className={styles.label}>Negative share</p>
        <p className={`${styles.value} ${styles.textNegative}`}>{val || `${negPct}%`}</p>
      </div>
    </div>
  );
}