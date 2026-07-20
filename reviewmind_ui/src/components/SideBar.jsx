import { LayoutDashboard, FileText, AlertTriangle, Sparkles, Globe, LogOut } from 'lucide-react';
import styles from '../styles/SideBar.module.css';
import { logDebug } from '../utils/logger';

const FILE = 'Sidebar.jsx';
const navItems = [
  { key: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { key: 'reviews', label: 'All Reviews', Icon: FileText },
  { key: 'complaints', label: 'Complaints', Icon: AlertTriangle },
  { key: 'insights', label: 'Insights', Icon: Sparkles },
  { key: 'sources', label: 'Sources', Icon: Globe },
];

export default function Sidebar({ activeNav, setActiveNav, userName, onLogout }) {
  
  const displayName = userName || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.logoBox}>R</div>
        <span className={styles.logoText}>ReviewMind</span>
      </div>
      <nav>
        <p className={styles.menuLabel}>Menu</p>
        {navItems.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => { logDebug(FILE, 'nav', key); setActiveNav(key); }} className={`${styles.navItem} ${activeNav === key ? styles.active : ''}`}>
            <span className={styles.navIcon}><Icon size={16} /></span>
            {label}
          </button>
        ))}
      </nav>
      <div className={styles.bottomSection}>
        <div className={styles.userArea}>
          <div className={styles.userAvatar}>{initials}</div>
          {}
          <div className={styles.userName}>{displayName}</div>
        </div>
        <button className={styles.logoutBtn} onClick={onLogout}>
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
}