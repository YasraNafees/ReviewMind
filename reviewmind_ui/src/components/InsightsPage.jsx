import styles from '../styles/InsightsPage.module.css';
import EmptyState from './EmptyState';

export default function InsightsPage({ summary, summaryLoading, onGenerate }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.title}>Full analysis</p>
          <p className={styles.subtitle}>Detailed AI breakdown of review themes, patterns, and recommendations</p>
        </div>
        <button className={styles.genBtn} onClick={onGenerate} disabled={summaryLoading}>
          {summaryLoading ? 'Analyzing...' : 'Run analysis'}
        </button>
      </div>

      {summary ? (
        <div className={`${styles.content} ${styles.hasContent}`}>{summary}</div>
      ) : (
        <EmptyState 
          icon="insights" 
          title="No insights generated" 
          description="Click 'Run analysis' and we'll go through all your reviews to find patterns, pain points, and actionable recommendations." 
          action="Run analysis"
          onAction={onGenerate}
        />
      )}
    </div>
  );
}