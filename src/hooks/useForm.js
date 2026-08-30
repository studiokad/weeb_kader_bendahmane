import { useCallback, useState } from "react";

/**
 * Gestion d'un formulaire controle : valeurs, erreurs, champs visites, envoi.
 *
 * Choix de conception : l'erreur d'un champ n'apparait qu'apres que
 * l'utilisateur l'a quitte (blur) ou qu'il a tente d'envoyer le formulaire.
 * Afficher "champ requis" des la premiere frappe reproche a l'utilisateur
 * de ne pas avoir fini de taper.
 *
 * @param {Object} initialValues - Valeur de depart de chaque champ.
 * @param {Function} validate    - (values) => { champ: "message" }. Objet vide = valide.
 * @param {Function} onSubmit    - (values) => Promise. Appele si la validation passe.
 */
export function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState("");

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setValues((previous) => ({ ...previous, [name]: value }));

      // Si le champ etait deja en erreur, on revalide a chaque frappe :
      // l'utilisateur voit l'erreur disparaitre des qu'il a corrige.
      if (errors[name]) {
        const nextErrors = validate({ ...values, [name]: value });
        setErrors((previous) => ({ ...previous, [name]: nextErrors[name] }));
      }
    },
    [errors, validate, values],
  );

  const handleBlur = useCallback(
    (event) => {
      const { name } = event.target;
      setTouched((previous) => ({ ...previous, [name]: true }));
      setErrors(validate(values));
    },
    [validate, values],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setSubmitError("");

      const nextErrors = validate(values);
      setErrors(nextErrors);

      // A l'envoi, tous les champs deviennent "visites" pour que
      // chaque erreur restante soit effectivement affichee.
      setTouched(
        Object.keys(values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {},
        ),
      );

      if (Object.keys(nextErrors).length > 0) {
        setStatus("error");
        return;
      }

      try {
        setStatus("submitting");
        await onSubmit(values);
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setSubmitError(error.message || "Une erreur est survenue.");
      }
    },
    [onSubmit, validate, values],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({});
    setErrors({});
    setStatus("idle");
    setSubmitError("");
  }, [initialValues]);

  /**
   * Erreur a afficher pour un champ : uniquement si le champ a ete visite.
   * @param {string} name
   * @returns {string|undefined}
   */
  const errorFor = useCallback(
    (name) => (touched[name] ? errors[name] : undefined),
    [errors, touched],
  );

  return {
    values,
    errors,
    touched,
    status,
    submitError,
    isSubmitting: status === "submitting",
    handleChange,
    handleBlur,
    handleSubmit,
    errorFor,
    reset,
  };
}

export default useForm;
