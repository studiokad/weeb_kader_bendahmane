import { Link } from "react-router-dom";
import BrowserMockup from "../../components/ui/BrowserMockup/BrowserMockup";
import Button from "../../components/ui/Button/Button";
import styles from "./Home.module.css";

/**
 * Logos des references affichees dans "Ils nous font confiance".
 * Chaque marque a sa forme dessinee en SVG : le bloc reste net a toute taille
 * et suit la couleur du texte, sans fichier image a charger.
 */
const BRANDS = [
  { id: "smartfinder", name: "SmartFinder", path: "M12 2l9 5v10l-9 5-9-5V7l9-5zm0 4L7 9l5 3 5-3-5-3z" },
  { id: "zoomerr", name: "Zoomerr", path: "M12 2a10 10 0 100 20 10 10 0 000-20zm1 4l-5 7h3.5l-.5 5 5-7H12.5L13 6z" },
  { id: "shells", name: "SHELLS", path: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 017 7 4 4 0 01-4 4h-1.5a2 2 0 00-1.4 3.4A7 7 0 0112 5z" },
  { id: "waves", name: "WAVES", path: "M3 12h2V8H3v4zm4 5h2V5H7v12zm4-2h2V7h-2v8zm4 4h2V3h-2v16zm4-6h2v-4h-2v4z" },
  { id: "artvenue", name: "ArtVenue", path: "M3 20V4h4l10 12V4h4v16h-4L7 8v12H3z" },
];

/**
 * Angles de rotation de la pile de carres de la derniere section.
 * Le dernier element de la liste est le carre plein, au premier plan.
 */
const SQUARE_ANGLES = [-24, -16, -8, 0, 8];

/** Fleche des liens de section, reprise de la maquette. */
function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14m-6-6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>
            Explorez le <span className={styles.accent}>Web</span> sous toutes
            ses <span className={styles.underlined}>facettes</span>
          </h1>

          <p className={styles.lead}>
            Le monde du web évolue constamment, et nous sommes là pour vous
            guider à travers ses tendances, technologies et meilleures
            pratiques. Que vous soyez développeur, designer ou passionné du
            digital, notre blog vous offre du contenu de qualité pour rester à
            la pointe.
          </p>

          <div className={styles.actions}>
            <Button to="/blog">Découvrir les articles</Button>
            <Button to="/contact" variant="outline">
              S’abonner à la newsletter
            </Button>
          </div>

          <div className={styles.heroVisual}>
            <BrowserMockup />
          </div>
        </div>
      </section>

      {/* ---------- References ---------- */}
      <section className={styles.trust}>
        <div className="container">
          <h2 className={styles.trustTitle}>Ils nous font confiance</h2>

          <ul className={styles.logos}>
            {BRANDS.map((brand) => (
              <li className={styles.logo} key={brand.id}>
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d={brand.path} />
                </svg>
                {brand.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Section : apprendre ---------- */}
      <section className={styles.feature}>
        <div className={`container ${styles.featureGrid}`}>
          <div>
            <span className={styles.eyebrow}>
              Des ressources pour tous les niveaux
            </span>

            <h2 className={styles.featureTitle}>
              <span className={styles.accent}>Apprenez</span> et progressez
            </h2>

            <p className={styles.featureText}>
              Que vous débutiez en développement web ou que vous soyez un expert
              cherchant à approfondir vos connaissances, nous vous proposons des
              tutoriels, guides et bonnes pratiques pour apprendre efficacement.
            </p>

            <Link to="/blog" className={styles.featureLink}>
              Explorer les ressources
              <ArrowIcon />
            </Link>
          </div>

          <div className={styles.featureVisual}>
            <BrowserMockup url="learn.weeb.ai" />
          </div>
        </div>
      </section>

      {/* ---------- Section : tendances ---------- */}
      <section className={`${styles.feature} ${styles.reversed}`}>
        <div className={`container ${styles.featureGrid}`}>
          <div>
            <span className={styles.eyebrow}>
              Le web, un écosystème en constante évolution
            </span>

            <h2 className={styles.featureTitle}>
              Restez informé des dernières{" "}
              <span className={styles.accent}>tendances</span>
            </h2>

            <p className={styles.featureText}>
              Chaque semaine, nous analysons les nouveautés du web : frameworks
              émergents, bonnes pratiques SEO, accessibilité, et bien plus
              encore. Ne manquez aucune actualité du digital !
            </p>

            <Link to="/blog" className={styles.featureLink}>
              Lire les articles récents
              <ArrowIcon />
            </Link>
          </div>

          <div className={styles.featureVisual}>
            <div className={styles.shapeStack} aria-hidden="true">
              {SQUARE_ANGLES.map((angle, index) => (
                <span
                  key={angle}
                  className={[
                    styles.square,
                    index === SQUARE_ANGLES.length - 1
                      ? styles.squareFilled
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ "--angle": `${angle}deg` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
