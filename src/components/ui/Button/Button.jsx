import { Link } from "react-router-dom";
import styles from "./Button.module.css";

/**
 * Bouton polymorphe du design system.
 *
 * Rend une balise differente selon les props recues, sans que l'appelant
 * ait a choisir : `to` produit un <Link> interne, `href` un <a> externe,
 * sinon un <button>. L'apparence reste identique dans les trois cas.
 *
 * @param {"primary"|"outline"|"ghost"} [variant="primary"] - Style visuel.
 * @param {"sm"|"md"|"lg"}                [size="md"]         - Taille.
 * @param {boolean}                       [block=false]       - Pleine largeur.
 * @param {string}                        [to]                - Route interne (react-router).
 * @param {string}                        [href]              - URL externe.
 * @param {React.ReactNode}               children            - Libelle du bouton.
 */
function Button({
  variant = "primary",
  size = "md",
  block = false,
  to,
  href,
  className = "",
  children,
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    size !== "md" ? styles[size] : "",
    block ? styles.block : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noreferrer noopener"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
