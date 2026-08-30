import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Button from "../../ui/Button/Button";
import styles from "./Header.module.css";

/** Liens de navigation principaux, partages par le desktop et le mobile. */
const NAV_LINKS = [
  { to: "/", label: "Accueil", end: true },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

/**
 * La maquette place le logo, puis la navigation, puis les actions poussees a
 * droite. Cet ordre est porte par le JSX ; le CSS ne fait que l'espacer.
 */

/**
 * En-tete du site : logo, navigation et acces au compte.
 *
 * Deux rendus de la meme navigation cohabitent, la bascule etant faite en CSS
 * a 900px : une barre horizontale au-dessus, un panneau deroulant en dessous.
 */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();

  // Changer de page ferme le menu : sans cela, le panneau resterait ouvert
  // par-dessus la page qui vient d'etre chargee.
  //
  // L'ajustement se fait pendant le rendu, et non dans un effet : React
  // relance immediatement le rendu avec la nouvelle valeur, sans afficher
  // l'etat intermediaire ou le panneau serait encore ouvert sur la nouvelle
  // page. Un effet, lui, aurait produit une image de trop.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setIsMenuOpen(false);
  }

  // Ombre portee sur l'en-tete des que la page n'est plus en haut.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);

    onScroll(); // etat initial, au cas ou la page est rechargee en cours de defilement
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu ouvert : la touche Echap le referme. Le panneau se deplie sous la
  // barre sans couvrir la page, il n'y a donc pas de defilement a bloquer.
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const navLinkClass = ({ isActive }) =>
    [styles.link, isActive ? styles.linkActive : ""].filter(Boolean).join(" ");

  const panelLinkClass = ({ isActive }) =>
    [styles.panelLink, isActive ? styles.panelLinkActive : ""]
      .filter(Boolean)
      .join(" ");

  return (
    <header
      className={[styles.header, isScrolled ? styles.scrolled : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.bar}>
        <NavLink to="/" className={styles.logo} aria-label="Weeb, accueil">
          weeb
        </NavLink>

        {/* Navigation desktop */}
        <nav className={styles.nav} aria-label="Navigation principale">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <NavLink to="/login" className={navLinkClass}>
            Se connecter
          </NavLink>
          <Button to="/blog/nouveau" size="sm">
            Rejoindre
          </Button>
        </div>

        {/* Declencheur mobile */}
        <button
          type="button"
          className={[styles.burger, isMenuOpen ? styles.open : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="menu-mobile"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <span className={styles.burgerBox} aria-hidden="true">
            <span className={styles.burgerBar} />
            <span className={styles.burgerBar} />
            <span className={styles.burgerBar} />
          </span>
        </button>
      </div>

      {/* Panneau mobile. Il reste dans le DOM pour pouvoir etre anime,
          mais `inert` le retire du parcours clavier quand il est ferme. */}
      <nav
        id="menu-mobile"
        className={[styles.panel, isMenuOpen ? styles.panelOpen : ""]
          .filter(Boolean)
          .join(" ")}
        aria-label="Navigation mobile"
        inert={!isMenuOpen ? "" : undefined}
      >
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={panelLinkClass}>
            {label}
          </NavLink>
        ))}

        <div className={styles.panelActions}>
          <Button to="/login" variant="outline" block>
            Se connecter
          </Button>
          <Button to="/blog/nouveau" block>
            Rejoindre
          </Button>
        </div>
      </nav>

    </header>
  );
}

export default Header;
