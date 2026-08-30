import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import styles from "./ArticleCard.module.css";

/**
 * Carte d'article utilisee dans la liste du blog.
 *
 * La carte entiere est cliquable : le lien enveloppe le contenu, ce qui evite
 * d'avoir plusieurs cibles concurrentes pour une seule destination.
 *
 * @param {Object} article - Article a afficher.
 */
function ArticleCard({ article }) {
  return (
    <article className={styles.card}>
      <Link to={`/blog/${article.slug}`}>
        <div className={styles.cover}>
          <div
            className={styles.coverInner}
            style={{ background: article.cover }}
            aria-hidden="true"
          />
          <span className={styles.category}>{article.category}</span>
        </div>

        <div className={styles.body}>
          <p className={styles.meta}>
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            <span aria-hidden="true">&middot;</span>
            <span>{article.readingTime} min de lecture</span>
          </p>

          <h3 className={styles.title}>{article.title}</h3>
          <p className={styles.excerpt}>{article.excerpt}</p>

          <span className={styles.more}>
            Lire l’article
            <svg
              className={styles.arrow}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14m-6-6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default ArticleCard;
