/**
 * Met une date ISO au format francais lisible.
 *
 * Isolee dans son propre module : partagee par la carte d'article et la page
 * de lecture, elle n'a pas a vivre dans un fichier de composant.
 *
 * @param {string} isoDate - Date au format "AAAA-MM-JJ".
 * @returns {string} ex. "18 aout 2026"
 */
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default formatDate;
