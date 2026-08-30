import Button from "../../components/ui/Button/Button";
import styles from "./NotFound.module.css";

/** Page affichee pour toute adresse ne correspondant a aucune route. */
function NotFound() {
  return (
    <div className={styles.page}>
      <p className={styles.code}>404</p>
      <h1>Cette page n’existe pas</h1>
      <p className={styles.text}>
        Le lien est peut-être erroné, ou la page a été déplacée depuis votre
        dernière visite.
      </p>
      <div className={styles.actions}>
        <Button to="/">Revenir à l’accueil</Button>
        <Button to="/blog" variant="ghost">
          Voir le blog
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
