import { useMemo, useState } from "react";
import ArticleCard from "../../components/ui/ArticleCard/ArticleCard";
import Button from "../../components/ui/Button/Button";
import SectionTitle from "../../components/ui/SectionTitle/SectionTitle";
import Slider from "../../components/ui/Slider/Slider";
import { useArticles } from "../../hooks/useArticles";
import { formatDate } from "../../utils/formatDate";
import styles from "./Blog.module.css";

const ALL_CATEGORIES = "Tous";

/** Nombre d'articles mis en avant dans le carrousel de tete. */
const FEATURED_COUNT = 3;

function Blog() {
  const { articles, isLoading, error, reload } = useArticles();
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);

  // Les filtres sont deduits des articles reellement presents : une nouvelle
  // categorie apparait toute seule des qu'un article l'utilise.
  const categories = useMemo(() => {
    const found = new Set(articles.map((article) => article.category));
    return [ALL_CATEGORIES, ...[...found].sort()];
  }, [articles]);

  const visibleArticles = useMemo(() => {
    if (activeCategory === ALL_CATEGORIES) return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [articles, activeCategory]);

  return (
    <div className={styles.page}>
      <div className="container">
        <SectionTitle
          as="h1"
          eyebrow="Blog"
          title="Notes de studio"
          subtitle="Ce que nous apprenons en construisant des sites : méthode, CSS, accessibilité et performance."
        />

        {/* ---------- Chargement ---------- */}
        {isLoading && (
          <div className={styles.grid} aria-busy="true" aria-live="polite">
            <span className="sr-only">Chargement des articles…</span>
            {[0, 1, 2].map((index) => (
              <div className={styles.skeleton} key={index} aria-hidden="true" />
            ))}
          </div>
        )}

        {/* ---------- Erreur ---------- */}
        {!isLoading && error && (
          <div className={styles.state} role="alert">
            <h2>Chargement impossible</h2>
            <p className={styles.stateText}>{error}</p>
            <Button onClick={reload}>Réessayer</Button>
          </div>
        )}

        {/* ---------- Liste ---------- */}
        {!isLoading && !error && (
          <>
            {/* Carrousel des articles les plus recents. Element ajoute :
                il n'est pas demande par la maquette, mais met en avant le
                contenu editorial des l'arrivee sur la page. */}
            {articles.length > 1 && (
              <div className={styles.featured}>
                <Slider
                  slides={articles.slice(0, FEATURED_COUNT)}
                  label="Articles a la une"
                  autoPlayMs={8000}
                  renderSlide={(article) => (
                    <article className={styles.featuredSlide}>
                      <span className={styles.featuredCategory}>
                        {article.category}
                      </span>
                      <h2 className={styles.featuredTitle}>{article.title}</h2>
                      <p className={styles.featuredExcerpt}>{article.excerpt}</p>
                      <p className={styles.featuredMeta}>
                        <time dateTime={article.publishedAt}>
                          {formatDate(article.publishedAt)}
                        </time>
                        <span aria-hidden="true">&middot;</span>
                        <span>{article.readingTime} min de lecture</span>
                      </p>
                      <Button to={`/blog/${article.slug}`} size="sm">
                        Lire l&rsquo;article
                      </Button>
                    </article>
                  )}
                />
              </div>
            )}

            <div className={styles.toolbar}>
              <div className={styles.filters} role="group" aria-label="Filtrer par catégorie">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={[
                      styles.filter,
                      category === activeCategory ? styles.filterActive : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={category === activeCategory}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <p className={styles.count} aria-live="polite">
                {visibleArticles.length} article
                {visibleArticles.length > 1 ? "s" : ""}
              </p>
            </div>

            {visibleArticles.length === 0 ? (
              <div className={styles.state}>
                <h2>Aucun article ici</h2>
                <p className={styles.stateText}>
                  Il n’y a pas encore d’article dans cette catégorie. Le premier
                  pourrait être le vôtre.
                </p>
                <Button to="/blog/nouveau">Publier un article</Button>
              </div>
            ) : (
              <div className={styles.grid}>
                {visibleArticles.map((article) => (
                  <ArticleCard article={article} key={article.id} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Blog;
