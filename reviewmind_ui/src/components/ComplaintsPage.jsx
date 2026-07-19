import styles from '../styles/ComplaintsPage.module.css';
import EmptyState from './EmptyState';

export default function ComplaintsPage({ clusters, maxComplaints, loading }) {
  if (!loading && clusters.length === 0) {
    return (
      <div className={styles.card}>
        <EmptyState 
          icon="complaints" 
          title="No complaint analysis yet" 
          description="After processing reviews, we'll cluster similar complaints and show detailed breakdowns here." 
        />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <p className={styles.title}>Complaint cluster details</p>
      <div className={styles.list}>
        {clusters.map((c, i) => {
          const pct = maxComplaints > 0 ? Math.round((c.complaints / maxComplaints) * 100) : 0;
          return (
            <div key={i} className={styles.row}>
              <div className={styles.rowHead}>
                <span className={styles.rowName}>{c.name}</span>
                <span className={styles.rowCount}>{c.complaints} reviews</span>
              </div>
              <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${pct}%` }} />
              </div>
              <p className={styles.rowPercent}>{pct}% of all complaints</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}