import styles from "./BrowserMockup.module.css";

/**
 * Fenetre de navigateur factice presentant une capture d'interface.
 *
 * La maquette place ce visuel deux fois : en grand sous le titre d'accueil,
 * puis en plus petit dans la section "Apprenez et progressez". Le composant
 * est donc parametre par son adresse affichee, et purement decoratif :
 * il est retire de l'arbre d'accessibilite.
 *
 * @param {string} [url="app.weeb.ai"] - Adresse affichee dans la barre.
 */
function BrowserMockup({ url = "app.weeb.ai" }) {
  return (
    <div className={styles.window} aria-hidden="true">
      <div className={styles.chrome}>
        <span className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </span>

        <span className={styles.urlBar}>{url}</span>

        <span className={styles.navArrows}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.sidebar}>
          <span className={`${styles.line} ${styles.lineAccent}`} style={{ width: "100%" }} />
          <span className={styles.sidebarRow}>
            <span className={`${styles.shape} ${styles.shapeCircle}`} />
            <span className={styles.line} style={{ width: "70%" }} />
          </span>
          <span className={styles.sidebarRow}>
            <span className={styles.shape} />
            <span className={styles.line} style={{ width: "60%" }} />
          </span>
          <span className={styles.sidebarRow}>
            <span className={styles.shapeTriangle} />
            <span className={styles.line} style={{ width: "75%" }} />
          </span>
        </div>

        <div className={styles.main}>
          <div className={styles.textBlock}>
            <span className={`${styles.line} ${styles.lineAccent}`} style={{ width: "45%" }} />
            <span className={styles.line} style={{ width: "100%" }} />
            <span className={styles.line} style={{ width: "85%" }} />
            <span className={styles.line} style={{ width: "35%", marginTop: "1rem" }} />
            <span className={styles.line} style={{ width: "70%" }} />
          </div>

          <div className={styles.cards}>
            <span className={styles.card}>
              <span className={styles.diamond} />
            </span>
            <span className={styles.card}>
              <span className={styles.quarter} />
            </span>
            <span className={styles.card}>
              <span className={styles.circle} />
            </span>
            <span className={styles.card}>
              <span className={styles.stars}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowserMockup;
