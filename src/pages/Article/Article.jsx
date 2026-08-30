import { Link, useParams } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import { formatDate } from "../../utils/formatDate";
import { useArticle } from "../../hooks/useArticles";
import styles from "./Article.module.css";

/** Fleche de retour, reutilisee par les trois etats de la page. */
function BackLink() {
  return (
    <Link to="/blog" className={styles.back}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M19 12H5m6 6l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Retour au blog
    </Link>
  );
}

/**
 * Page de lecture d'un article.
 *
 * Sert de gabarit : le slug de l'URL determine le contenu affiche, la mise en
 * page ne change jamais. Les trois issues possibles d'un chargement
 * (en cours, introuvable, en erreur) ont chacune leur rendu.
 */
function Article() {
  const { slug } = useParams();
  const { article, isLoading, error, notFound } = useArticle(slug);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className="container container--narrow" aria-busy="true">
          <span className="sr-only">Chargement de l’article…</span>
          <div
            className={`${styles.skeletonLine} ${styles.skeletonTitle}`}
            aria-hidden="true"
          />
          {[0, 1, 2, 3, 4].map((index) => (
            <div className={styles.skeletonLine} key={index} aria-hidden="true" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <div className="container container--narrow">
          <div className={styles.state}>
            <h1>Article introuvable</h1>
            <p className={styles.stateText}>
              Cette adresse ne correspond à aucun article. Il a peut-être été
              renommé depuis que vous avez enregistré le lien.
            </p>
            <Button to="/blog">Voir tous les articles</Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className="container container--narrow">
          <div className={styles.state} role="alert">
            <h1>Chargement impossible</h1>
            <p className={styles.stateText}>{error}</p>
            <Button to="/blog">Retour au blog</Button>
          </div>
        </div>
      </div>
    );
  }

  // Le contenu est stocke en texte brut : chaque ligne vide separe deux
  // paragraphes. On evite ainsi d'injecter du HTML provenant du formulaire.
  const paragraphs = article.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={styles.page}>
      <div className="container container--narrow">
        <BackLink />

        <article>
          <header className={styles.header}>
            <span className={styles.category}>{article.category}</span>
            <h1 className={styles.title}>{article.title}</h1>

            <div className={styles.meta}>
              <span className={styles.author}>
                <span className={styles.avatar} aria-hidden="true">
                  {article.author.charAt(0)}
                </span>
                {article.author}
              </span>
              <span aria-hidden="true">&middot;</span>
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
              <span aria-hidden="true">&middot;</span>
              <span>{article.readingTime} min de lecture</span>
            </div>
          </header>

          <div
            className={styles.cover}
            style={{ background: article.cover }}
            aria-hidden="true"
          />

          <div className={styles.content}>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        <div className={styles.footerNav}>
          <BackLink />
          <p className={styles.share}>
            Un sujet à proposer ?
            <Button to="/blog/nouveau" size="sm" variant="ghost">
              Écrire un article
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Article;
