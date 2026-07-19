import styles from '../styles/LoginScreen.module.css';

export default function LoginScreen({ email, password, loginError, loginLoading, setEmail, setPassword, handleLogin }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <div className={styles.logoArea}>
            <div className={styles.logoBox}>R</div>
            <span className={styles.logoText}>ReviewMind</span>
          </div>
          <h1 className={styles.heading}>Understand what your customers actually think.</h1>
          <p className={styles.subheading}>Upload reviews, run sentiment analysis, cluster complaints, and chat with your data — all in one place.</p>
          <div className={styles.statsRow}>
            <div><div className={styles.statNum}>12k+</div><div className={styles.statLabel}>Reviews processed</div></div>
            <div><div className={styles.statNum}>94%</div><div className={styles.statLabel}>Accuracy rate</div></div>
            <div><div className={styles.statNum}>3s</div><div className={styles.statLabel}>Avg response</div></div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formBox}>
          <p className={styles.formLabel}>Sign in</p>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <form onSubmit={handleLogin}>
            <label className={styles.inputLabel}>Email</label>
            <input className={styles.inputField} type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <label className={styles.inputLabel}>Password</label>
            <input className={styles.inputField} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            {loginError && <div className={styles.errorBox}>{loginError}</div>}
            <button type="submit" className={styles.submitBtn} disabled={loginLoading}>{loginLoading ? 'Signing in...' : 'Continue'}</button>
          </form>
          <p className={styles.footer}>Secured with Supabase Auth</p>
        </div>
      </div>
    </div>
  );
}