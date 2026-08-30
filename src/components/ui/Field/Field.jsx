import { useId } from "react";
import styles from "./Field.module.css";

/**
 * Champ de formulaire unifie : input, textarea ou select.
 *
 * Regroupe le libelle, le controle et le message d'erreur dans un seul
 * composant pour que tous les formulaires du site partagent exactement le meme
 * comportement de focus et la meme restitution d'erreur.
 *
 * Apparence reprise de la maquette : trait sous le champ au repos, cadre
 * complet au focus, libelle violet centre qui remonte des que le champ est
 * actif ou rempli.
 *
 * L'identifiant est genere par `useId` : le lien label/controle reste correct
 * meme si le champ est affiche plusieurs fois sur la meme page.
 *
 * @param {"input"|"textarea"|"select"} [as="input"] - Type de controle rendu.
 * @param {string}  label    - Libelle affiche (obligatoire, sert aussi d'accessible name).
 * @param {string}  name     - Nom du champ, cle utilisee par useForm.
 * @param {string}  value    - Valeur controlee.
 * @param {Function} onChange - Appele a chaque saisie.
 * @param {Function} [onBlur] - Appele a la sortie du champ (declenche la validation).
 * @param {string}  [error]  - Message d'erreur ; sa presence bascule le champ en etat invalide.
 * @param {string}  [hint]   - Aide affichee sous le champ quand il n'y a pas d'erreur.
 */
function Field({
  as = "input",
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  hint,
  children,
  className = "",
  ...rest
}) {
  const generatedId = useId();
  const id = `${name}-${generatedId}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const hasError = Boolean(error);
  const isFilled = value !== undefined && value !== null && String(value) !== "";

  const wrapperClasses = [
    styles.field,
    hasError ? styles.hasError : "",
    isFilled ? styles.filled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Props communes aux trois types de controle.
  const controlProps = {
    id,
    name,
    value,
    onChange,
    onBlur,
    className: styles.control,
    "aria-invalid": hasError,
    "aria-describedby": hasError ? errorId : hint ? hintId : undefined,
    ...rest,
  };

  return (
    <div className={wrapperClasses}>
      {/* Le controle est declare avant le label : le label etant en position
          absolue, l'ordre visuel ne change pas, mais le controle reste le
          premier element focusable du groupe. Le lien reste porte par htmlFor. */}
      {as === "textarea" && <textarea {...controlProps} />}
      {as === "select" && <select {...controlProps}>{children}</select>}
      {as === "input" && <input {...controlProps} />}

      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      {hasError && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}

      {!hasError && hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  );
}

export default Field;
