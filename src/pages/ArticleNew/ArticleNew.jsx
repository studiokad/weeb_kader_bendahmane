import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import Field from "../../components/ui/Field/Field";
import SectionTitle from "../../components/ui/SectionTitle/SectionTitle";
import useForm from "../../hooks/useForm";
import {
  CATEGORIES,
  createArticle,
  estimateReadingTime,
} from "../../services/articlesApi";
import styles from "./ArticleNew.module.css";

const INITIAL_VALUES = {
  title: "",
  author: "",
  category: "",
  excerpt: "",
  content: "",
};

/**
 * Validation du formulaire de publication.
 *
 * Les longueurs minimales ne sont pas decoratives : un chapeau trop court
 * rend la carte du blog vide de sens, un contenu trop court ne merite pas
 * une page dediee.
 *
 * @param {typeof INITIAL_VALUES} values
 * @returns {Object} un message par champ invalide.
 */
function validateArticle(values) {
  const errors = {};

  const MIN_TITLE = 8;
  if (!values.title.trim()) {
    errors.title = "Donnez un titre à l’article.";
  } else if (values.title.trim().length < MIN_TITLE) {
    errors.title = `Titre trop court : ${MIN_TITLE} caractères minimum.`;
  }

  if (!values.author.trim()) {
    errors.author = "Indiquez le nom de l’auteur.";
  }

  if (!values.category) {
    errors.category = "Choisissez une catégorie.";
  }

  const MIN_EXCERPT = 40;
  if (!values.excerpt.trim()) {
    errors.excerpt = "Écrivez un chapeau : il s’affiche sur la carte du blog.";
  } else if (values.excerpt.trim().length < MIN_EXCERPT) {
    errors.excerpt = `Chapeau trop court : ${MIN_EXCERPT} caractères minimum.`;
  }

  const MIN_CONTENT = 200;
  if (!values.content.trim()) {
    errors.content = "Écrivez le contenu de l’article.";
  } else if (values.content.trim().length < MIN_CONTENT) {
    errors.content = `Contenu trop court : ${MIN_CONTENT} caractères minimum.`;
  }

  return errors;
}

function ArticleNew() {
  const navigate = useNavigate();
  const [createdSlug, setCreatedSlug] = useState(null);

  const submitArticle = useCallback(async (values) => {
    const article = await createArticle(values);
    setCreatedSlug(article.slug);
  }, []);

  const form = useForm({
    initialValues: INITIAL_VALUES,
    validate: validateArticle,
    onSubmit: submitArticle,
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

  const handleWriteAnother = () => {
    setCreatedSlug(null);
    reset();
  };

  if (status === "success" && createdSlug) {
    return (
      <div className={styles.page}>
        <div className="container container--narrow">
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
            <h1>Article publié</h1>
            <p className={styles.successText}>
              Votre article est en ligne et apparaît désormais en tête de la
              liste du blog.
            </p>
            <div className={styles.actions}>
              <Button onClick={() => navigate(`/blog/${createdSlug}`)}>
                Voir l’article
              </Button>
              <Button variant="ghost" onClick={handleWriteAnother}>
                En écrire un autre
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <SectionTitle
          as="h1"
          eyebrow="Rédaction"
          title="Publier un article"
          subtitle="Remplissez le formulaire : l’aperçu à droite montre le rendu de la carte au fil de la saisie."
        />

        <div className={styles.layout}>
          {/* ---------- Formulaire ---------- */}
          <div className={styles.formCard}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <Field
                label="Titre de l’article"
                name="title"
                placeholder="Un titre clair et spécifique"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errorFor("title")}
              />

              <div className={styles.row}>
                <Field
                  label="Auteur"
                  name="author"
                  autoComplete="name"
                  placeholder="Prenom Nom"
                  value={values.author}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errorFor("author")}
                />

                <Field
                  as="select"
                  label="Catégorie"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errorFor("category")}
                >
                  <option value="" disabled />
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Field>
              </div>

              <Field
                as="textarea"
                label="Chapeau"
                name="excerpt"
                rows={3}
                placeholder="Deux phrases qui donnent envie de lire la suite."
                value={values.excerpt}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errorFor("excerpt")}
                hint={`${values.excerpt.trim().length} / 40 caractères minimum`}
              />

              <Field
                as="textarea"
                label="Contenu"
                name="content"
                rows={12}
                placeholder="Le corps de l’article. Une ligne vide sépare deux paragraphes."
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errorFor("content")}
                hint={`${values.content.trim().length} / 200 caractères minimum`}
              />

              {submitError && (
                <p className={styles.submitError} role="alert">
                  {submitError}
                </p>
              )}

              <div className={styles.actions}>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Publication…" : "Publier l’article"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={reset}
                  disabled={isSubmitting}
                >
                  Tout effacer
                </Button>
              </div>
            </form>
          </div>

          {/* ---------- Apercu en direct ---------- */}
          <aside className={styles.preview} aria-label="Aperçu de l’article">
            <p className={styles.previewLabel}>
              <span className={styles.previewDot} aria-hidden="true" />
              Aperçu
            </p>

            <div className={styles.previewCover} aria-hidden="true" />

            <span className={styles.previewCategory}>
              {values.category || "Catégorie"}
            </span>

            <h2 className={styles.previewTitle}>
              {values.title || (
                <span className={styles.placeholder}>Titre de l’article</span>
              )}
            </h2>

            <p className={styles.previewExcerpt}>
              {values.excerpt || (
                <span className={styles.placeholder}>
                  Le chapeau apparaîtra ici, sur la carte du blog.
                </span>
              )}
            </p>

            <p className={styles.previewMeta}>
              <span>{values.author || "Auteur"}</span>
              <span aria-hidden="true">&middot;</span>
              <span>
                {values.content.trim()
                  ? `${estimateReadingTime(values.content)} min de lecture`
                  : "temps de lecture"}
              </span>
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ArticleNew;
