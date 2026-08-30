import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import styles from "./Layout.module.css";

/**
 * Coquille commune a toutes les pages : en-tete, contenu, pied de page.
 *
 * Le composant remonte aussi la page a chaque navigation. En SPA, le
 * navigateur ne le fait pas : sans cela, on arrive au milieu de la page
 * suivante apres avoir clique sur un lien en bas de page.
 */
function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#contenu">
        Aller au contenu principal
      </a>

      <Header />

      <main id="contenu" className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
