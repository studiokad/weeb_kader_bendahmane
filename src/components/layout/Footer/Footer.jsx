import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

/**
 * Colonnes du pied de page, reprises de la maquette.
 * Decrites en donnees : ajouter un lien n'implique pas de toucher au JSX.
 */
const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Pricing", to: "/contact" },
      { label: "Overview", to: "/" },
      { label: "Browse", to: "/blog" },
      { label: "Accessibility", to: "/contact" },
      { label: "Five", to: "/contact" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Brainstorming", to: "/contact" },
      { label: "Ideation", to: "/contact" },
      { label: "Wireframing", to: "/contact" },
      { label: "Research", to: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", to: "/contact" },
      { label: "Blog", to: "/blog" },
      { label: "Tutorials", to: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/" },
      { label: "Press", to: "/contact" },
      { label: "Events", to: "/contact" },
      { label: "Careers", to: "/contact" },
    ],
  },
];

/**
 * Icones des reseaux sociaux, dessinees en SVG plutot que chargees en image :
 * elles heritent de la couleur du texte et restent nettes a toute taille.
 */
const SOCIALS = [
  {
    id: "youtube",
    label: "YouTube",
    path: "M21.6 7.2a2.5 2.5 0 00-1.75-1.77C18.25 5 12 5 12 5s-6.25 0-7.85.43A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.75 1.77C5.75 19 12 19 12 19s6.25 0 7.85-.43a2.5 2.5 0 001.75-1.77A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3-5.2 3z",
  },
  {
    id: "facebook",
    label: "Facebook",
    path: "M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6A22 22 0 0014.3 3.5c-2.4 0-4 1.45-4 4.1v2.3H7.6V13h2.7v8h3.2z",
  },
  {
    id: "twitter",
    label: "Twitter",
    path: "M22 5.9c-.75.33-1.55.55-2.4.65a4.15 4.15 0 001.83-2.3c-.8.48-1.7.82-2.65 1a4.15 4.15 0 00-7.1 3.79A11.8 11.8 0 013.1 4.7a4.15 4.15 0 001.29 5.54c-.68-.02-1.32-.21-1.88-.52v.05a4.15 4.15 0 003.33 4.07c-.62.17-1.28.2-1.9.07a4.16 4.16 0 003.88 2.89A8.34 8.34 0 012 18.5a11.76 11.76 0 006.37 1.87c7.64 0 11.82-6.33 11.82-11.82l-.01-.54A8.4 8.4 0 0022 5.9z",
  },
  {
    id: "instagram",
    label: "Instagram",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.89 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm6.4-10.4a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    path: "M6.94 5a1.94 1.94 0 11-3.88 0 1.94 1.94 0 013.88 0zM3.2 8.4h3.5V21H3.2V8.4zm5.7 0h3.35v1.72h.05c.47-.88 1.6-1.8 3.3-1.8 3.53 0 4.18 2.32 4.18 5.34V21h-3.5v-5.63c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21H8.9V8.4z",
  },
];

/**
 * Pied de page du site.
 *
 * La classe `surface-light` renverse les tokens de couleur pour ce bloc :
 * c'est la seule zone claire d'un site sombre, conformement a la maquette.
 */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} surface-light`}>
      <div className="container">
        <div className={styles.grid}>
          <Link to="/" className={styles.logo} aria-label="Weeb, accueil">
            weeb
          </Link>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className={styles.columnTitle}>{column.title}</h2>
              <ul className={styles.list}>
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link to={link.to} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {year} Weeb, Inc. All rights reserved.
          </p>

          <ul className={styles.socials}>
            {SOCIALS.map((social) => (
              <li key={social.id}>
                <a
                  href="#"
                  className={styles.social}
                  aria-label={social.label}
                  onClick={(event) => event.preventDefault()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d={social.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
