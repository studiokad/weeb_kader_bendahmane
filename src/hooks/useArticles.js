import { useCallback, useEffect, useState } from "react";
import { fetchArticleBySlug, fetchArticles } from "../services/articlesApi";

/**
 * Charge la liste des articles.
 *
 * Expose les trois etats d'une requete (chargement, erreur, donnees) pour que
 * la page puisse afficher un squelette, un message d'erreur avec bouton de
 * relance, ou la liste : jamais un ecran vide sans explication.
 */
export function useArticles() {
  // Les trois champs d'une requete sont regroupes dans un seul etat : ils
  // changent toujours ensemble, et une mise a jour unique evite les rendus
  // intermediaires ou l'on serait a la fois "en chargement" et "en erreur".
  const [state, setState] = useState({
    articles: [],
    isLoading: true,
    error: null,
  });

  // Incremente par `reload` : sert de declencheur au chargement.
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    // Garde anti-course : une reponse arrivee apres demontage, ou apres une
    // relance plus recente, ne doit pas ecraser l'etat courant.
    let isCurrent = true;

    async function load() {
      try {
        const articles = await fetchArticles();
        if (isCurrent) setState({ articles, isLoading: false, error: null });
      } catch (caught) {
        if (isCurrent) {
          setState({
            articles: [],
            isLoading: false,
            error: caught.message || "Impossible de charger les articles.",
          });
        }
      }
    }

    load();
    return () => {
      isCurrent = false;
    };
  }, [reloadCount]);

  /** Relance le chargement. Appele depuis un clic, jamais depuis un effet. */
  const reload = useCallback(() => {
    setState((previous) => ({ ...previous, isLoading: true, error: null }));
    setReloadCount((count) => count + 1);
  }, []);

  return { ...state, reload };
}

/**
 * Charge un article unique a partir de son slug.
 *
 * `notFound` est distingue d'`error` : une adresse inexistante n'est pas une
 * panne, et les deux cas n'appellent pas le meme message a l'ecran.
 *
 * @param {string} slug
 */
export function useArticle(slug) {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Garde anti-course : si le slug change avant la fin de la requete,
    // la reponse obsolete ne doit pas ecraser la nouvelle.
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const found = await fetchArticleBySlug(slug);
        if (!isCurrent) return;

        if (found) setArticle(found);
        else setNotFound(true);
      } catch (caught) {
        if (isCurrent) setError(caught.message || "Chargement impossible.");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    load();
    return () => {
      isCurrent = false;
    };
  }, [slug]);

  return { article, isLoading, error, notFound };
}
