import styles from "./page.module.css";

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>Dashboard · Coming Soon</div>
      <h1 className={styles.title}>AIcaller<br /><span className={styles.dim}>Dashboard</span></h1>
      <p className={styles.sub}>
        Create agents, upload knowledge bases, connect phone numbers,
        and monitor conversations — all in one place.
      </p>
      <div className={styles.features}>
        {[
          ["◎", "Manage Agents"],
          ["⬡", "Knowledge Bases"],
          ["◈", "Phone Numbers"],
          ["≡", "Conversations"],
        ].map(([icon, label]) => (
          <div key={label} className={styles.feature}>
            <span className={styles.featureIcon}>{icon}</span>
            <span className={styles.featureLabel}>{label}</span>
          </div>
        ))}
      </div>
      <p className={styles.note}>Development in progress.</p>
    </div>
  );
}