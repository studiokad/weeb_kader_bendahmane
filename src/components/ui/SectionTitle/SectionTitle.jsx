import styles from "./SectionTitle.module.css";

/**
 * En-tete de section : sur-titre, titre et sous-titre.
 *
 * Centralise le rythme vertical et la hierarchie typographique afin que
 * toutes les sections du site s'alignent sans repeter les memes marges.
 *
 * @param {string} [eyebrow]      - Court sur-titre affiche dans une pastille.
 * @param {string} title          - Titre de la section.
 * @param {string} [subtitle]     - Phrase d'accroche sous le titre.
 * @param {boolean} [centered]    - Centre le bloc et son texte.
 * @param {"h1"|"h2"|"h3"} [as="h2"] - Niveau de titre, a choisir selon la page.
 */
function SectionTitle({
  eyebrow,
  title,
  subtitle,
  centered = false,
  as: Heading = "h2",
}) {
  const classes = [styles.header, centered ? styles.centered : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={classes}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <Heading className={styles.title}>{title}</Heading>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}

export default SectionTitle;
