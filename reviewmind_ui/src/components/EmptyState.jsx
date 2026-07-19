import { BarChart3, FileText, Lightbulb, Globe, AlertTriangle } from 'lucide-react';
// PEHLE THA: import styles from './EmptyState.module.css';
// AB YEH HOGA:
import styles from '../styles/EmptyState.module.css';


// ... baaki code same rahega

const iconMap = { sentiment: BarChart3, reviews: FileText, insights: Lightbulb, sources: Globe, complaints: AlertTriangle };

export default function EmptyState({ icon, title, description, action, onAction }) {
  const IconComponent = iconMap[icon] || FileText;

  return (
    <div className={styles.wrapper}>
      <div className={styles.iconBox}>
        <IconComponent size={24} color="var(--text-muted)" />
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
      {action && <button className={styles.actionBtn} onClick={onAction}>{action}</button>}
    </div>
  );
}