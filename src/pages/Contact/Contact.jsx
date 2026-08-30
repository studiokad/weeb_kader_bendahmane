import { useCallback } from "react";
import Button from "../../components/ui/Button/Button";
import Field from "../../components/ui/Field/Field";
import useForm from "../../hooks/useForm";
import styles from "./Contact.module.css";

const INITIAL_VALUES = {
  lastName: "",
  firstName: "",
  phone: "",
  email: "",
  message: "",
};

/**
 * Validation du formulaire de contact.
 *
 * Fonction pure declaree hors du composant : elle ne depend que de ses
 * arguments, garde une identite stable entre deux rendus, et peut etre
 * testee isolement.
 *
 * @param {typeof INITIAL_VALUES} values
 * @returns {Object} un message par champ invalide ; objet vide si tout est bon.
 */
function validateContact(values) {
  const errors = {};

  if (!values.lastName.trim()) {
    errors.lastName = "Indiquez votre nom.";
  }

  if (!values.firstName.trim()) {
    errors.firstName = "Indiquez votre prénom.";
  }

  // Le telephone est facultatif : on ne le controle que s'il est renseigne.
  if (values.phone.trim() && !/^[0-9+\s().-]{8,20}$/.test(values.phone.trim())) {
    errors.phone = "Ce numéro de téléphone n'est pas valide.";
  }

  if (!values.email.trim()) {
    errors.email = "Indiquez votre adresse email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
    errors.email = "Cette adresse email n'est pas valide.";
  }

  const MIN_MESSAGE_LENGTH = 20;
  if (!values.message.trim()) {
    errors.message = "Écrivez votre message.";
  } else if (values.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = `Encore un peu de détail : ${MIN_MESSAGE_LENGTH} caractères minimum.`;
  }

  return errors;
}

function Contact() {
  /**
   * Envoi du formulaire.
   *
   * Aucun serveur n'est branche a ce stade du projet : on simule l'appel
   * reseau pour que les etats de chargement et de confirmation soient
   * reellement exerces. Le remplacement par un vrai POST ne touchera
   * que cette fonction.
   */
  const submitContact = useCallback(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.info("Demande de contact envoyee :", values);
  }, []);

  const form = useForm({
    initialValues: INITIAL_VALUES,
    validate: validateContact,
    onSubmit: submitContact,
  });

  const {
    values,
    status,
    submitError,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    errorFor,
    reset,
  } = form;

  // Props partagees par tous les champs : evite de repeter cinq fois
  // les memes trois gestionnaires.
  const fieldProps = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errorFor(name),
  });

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Votre avis compte !</h1>

        <p className={styles.lead}>
          Votre retour est essentiel pour nous améliorer ! Partagez votre
          expérience, dites-nous ce que vous aimez et ce que nous pourrions
          améliorer. Vos suggestions nous aident à faire de ce blog une
          ressource toujours plus utile et enrichissante.
        </p>

        <div className={styles.card}>
          {status === "success" ? (
            <div className={styles.success} role="status">
              <span className={styles.successIcon} aria-hidden="true">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2>Message envoyé</h2>
              <p className={styles.successText}>
                Merci {values.firstName}. Votre retour est bien arrivé, nous
                revenons vers vous rapidement.
              </p>
              <Button variant="outline" onClick={reset}>
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <Field
                label="Nom"
                autoComplete="family-name"
                placeholder="Votre nom"
                {...fieldProps("lastName")}
              />

              <Field
                label="Prénom"
                autoComplete="given-name"
                placeholder="Votre prénom"
                {...fieldProps("firstName")}
              />

              <Field
                label="Téléphone"
                type="tel"
                autoComplete="tel"
                placeholder="06 12 34 56 78"
                {...fieldProps("phone")}
              />

              <Field
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.fr"
                {...fieldProps("email")}
              />

              <Field
                as="textarea"
                label="Message"
                rows={4}
                className={styles.full}
                placeholder="Votre message"
                {...fieldProps("message")}
              />

              {submitError && (
                <p className={`${styles.submitError} ${styles.full}`} role="alert">
                  {submitError}
                </p>
              )}

              <div className={`${styles.submitRow} ${styles.full}`}>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Envoi en cours…" : "Contact"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
