import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import Field from "../../components/ui/Field/Field";
import useForm from "../../hooks/useForm";
import styles from "./Login.module.css";

/**
 * Compte de demonstration.
 *
 * Il n'y a pas encore de serveur d'authentification : ces identifiants
 * permettent d'exercer le chemin nominal comme le chemin d'erreur.
 * Ils disparaitront avec le branchement de la vraie API.
 */
const DEMO_ACCOUNT = {
  email: "demo@weeb.fr",
  password: "weeb2026",
};

const INITIAL_VALUES = {
  email: "",
  password: "",
};

/**
 * Validation du formulaire de connexion.
 *
 * On verifie le format, jamais l'existence du compte : cote client, dire
 * "cet email est inconnu" renseignerait un attaquant sur les comptes valides.
 *
 * @param {typeof INITIAL_VALUES} values
 * @returns {Object} un message par champ invalide.
 */
function validateLogin(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Indiquez votre adresse email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
    errors.email = "Cette adresse email n'est pas valide.";
  }

  const MIN_PASSWORD_LENGTH = 8;
  if (!values.password) {
    errors.password = "Indiquez votre mot de passe.";
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Le mot de passe fait au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }

  return errors;
}

function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  /**
   * Tentative de connexion.
   *
   * Le message d'echec reste volontairement generique : il ne distingue pas
   * un email inconnu d'un mot de passe faux.
   */
  const submitLogin = useCallback(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const isValid =
      values.email.trim().toLowerCase() === DEMO_ACCOUNT.email &&
      values.password === DEMO_ACCOUNT.password;

    if (!isValid) {
      throw new Error("Identifiants incorrects. Vérifiez vos informations.");
    }
  }, []);

  const form = useForm({
    initialValues: INITIAL_VALUES,
    validate: validateLogin,
    onSubmit: submitLogin,
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
  } = form;

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <h1 className={styles.title}>Se connecter</h1>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {status === "success" && (
            <p className={`${styles.banner} ${styles.bannerSuccess}`} role="status">
              Connexion réussie. Redirection vers votre espace…
            </p>
          )}

          {submitError && (
            <p className={`${styles.banner} ${styles.bannerError}`} role="alert">
              {submitError}
            </p>
          )}

          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorFor("email")}
          />

          <div className={styles.passwordWrapper}>
            <Field
              label="Password"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errorFor("password")}
            />

            <button
              type="button"
              className={styles.toggle}
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              aria-label={
                isPasswordVisible
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
              aria-pressed={isPasswordVisible}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
                {isPasswordVisible && (
                  <path
                    d="M4 20L20 4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>

          <div className={styles.submitRow}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Connexion…" : "Se connecter"}
            </Button>
          </div>
        </form>

        <p>
          <Link to="/contact" className={styles.forgot}>
            Mot de passe oublié ?
          </Link>
        </p>

        <p className={styles.signup}>
          Vous n’avez pas de compte ? Vous pouvez en{" "}
          <Link to="/contact" className={styles.signupLink}>
            créer un
          </Link>
        </p>

        <p className={styles.demo}>
          Compte de démonstration : <code>{DEMO_ACCOUNT.email}</code> /{" "}
          <code>{DEMO_ACCOUNT.password}</code>
        </p>
      </div>
    </div>
  );
}

export default Login;
