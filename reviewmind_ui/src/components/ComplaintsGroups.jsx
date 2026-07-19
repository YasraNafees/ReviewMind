
import styles from '../styles/ComplaintsGroups.module.css';
import EmptyState from './EmptyState';


export default function ComplaintGroups({ clusters, maxComplaints, loading }) {
  if (!loading && clusters.length === 0) {
    return (
      <div className={styles.card}>
        <EmptyState icon="complaints" title="No complaints clustered" description="Once reviews are processed, we'll group similar complaints together." />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <p className={styles.title}>Top complaint groups</p>
      <div className={styles.list}>
        {clusters.map((c, i) => (
          <div key={i}>
            <div className={styles.rowHead}>
              <span className={styles.rowName}>{c.name}</span>
              <span className={styles.rowCount}>{c.complaints} mentions</span>
            </div>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${maxComplaints > 0 ? (c.complaints / maxComplaints) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}