// PEHLE THA: import styles from './AiInsights.module.css';
// AB YEH HOGA:
import styles from '../styles/AiInsights.module.css';

// ... baaki code same rahega
export default function AiInsights({ summary, summaryLoading, onGenerate }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.title}>Manager insights</p>
          <p className={styles.subtitle}>AI-generated summary of review themes</p>
        </div>
        <button className={styles.genBtn} onClick={onGenerate} disabled={summaryLoading}>{summaryLoading ? 'Generating...' : 'Generate'}</button>
      </div>
      <div className={`${styles.content} ${summary ? styles.hasContent : ''}`}>
        {summary || 'Click "Generate" to get a concise summary of what your customers are talking about.'}
      </div>
    </div>
  );
}