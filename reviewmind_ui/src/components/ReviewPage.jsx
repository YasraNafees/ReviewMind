import styles from '../styles/ReviewPages.module.css';
import EmptyState from './EmptyState';

export default function ReviewsPage({ totalReviews }) {
  if (totalReviews === 0) return (
    <div className={styles.card}>
      <EmptyState icon="reviews" title="No reviews loaded yet" description="Upload a CSV with your reviews and we'll list them all here with sentiment tags." />
    </div>
  );
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <p className={styles.title}>{totalReviews} reviews</p>
        <input className={styles.search} placeholder="Search reviews..." />
      </div>
      <div className={styles.body}>Reviews will appear here once processed.</div>
    </div>
  );
}