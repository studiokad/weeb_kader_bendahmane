/**
 * articlesApi — couche d'acces aux articles du blog.
 *
 * L'enonce autorise une API avant la vraie base de donnees. Toute l'application
 * passe donc par ce module et par lui seul : les pages ignorent d'ou viennent
 * les donnees. L'implementation actuelle persiste dans le localStorage du
 * navigateur et simule une latence reseau ; la remplacer par des appels HTTP
 * ne demandera de toucher aucun composant, tant que ces quatre fonctions
 * gardent leur signature et continuent de rendre des promesses.
 */

import seed from "../data/articles.seed.json";

const STORAGE_KEY = "weeb.articles.v1";
const FAKE_LATENCY_MS = 400;

/** Simule le temps d'aller-retour d'un vrai serveur. */
const delay = (ms = FAKE_LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Lit le stock local. Au premier lancement, ou si le contenu est illisible,
 * on repart des donnees de demonstration plutot que de planter la page.
 */
function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    // localStorage indisponible (navigation privee, quota) : mode lecture seule.
    return seed;
  }
}

function writeStore(articles) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {
    // L'ecriture echoue en navigation privee : l'article reste en memoire
    // pour la session en cours, ce qui suffit a la demonstration.
  }
}

/** Transforme un titre en identifiant d'URL lisible. */
export function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Estime le temps de lecture, sur une base de 200 mots par minute. */
export function estimateReadingTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Recupere tous les articles, du plus recent au plus ancien.
 * @returns {Promise<Array>}
 */
export async function fetchArticles() {
  await delay();

  return [...readStore()].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
  );
}

/**
 * Recupere un article par son slug.
 * @param {string} slug
 * @returns {Promise<Object|null>} l'article, ou null s'il n'existe pas.
 */
export async function fetchArticleBySlug(slug) {
  await delay(250);

  return readStore().find((article) => article.slug === slug) ?? null;
}

/**
 * Cree un article et le persiste.
 *
 * @param {{title: string, excerpt: string, content: string, category: string, author: string}} draft
 * @returns {Promise<Object>} l'article cree, complete de ses champs derives.
 * @throws {Error} si un article porte deja le meme slug.
 */
export async function createArticle(draft) {
  await delay(600);

  const articles = readStore();
  const slug = slugify(draft.title);

  if (articles.some((article) => article.slug === slug)) {
    throw new Error("Un article portant ce titre existe deja.");
  }

  const article = {
    id: `a${Date.now()}`,
    slug,
    title: draft.title.trim(),
    excerpt: draft.excerpt.trim(),
    content: draft.content.trim(),
    category: draft.category,
    author: draft.author.trim(),
    readingTime: estimateReadingTime(draft.content),
    publishedAt: new Date().toISOString().slice(0, 10),
    cover: "linear-gradient(135deg, #4f2ff0, #0b0d12)",
  };

  writeStore([article, ...articles]);
  return article;
}

/** Categories proposees dans le formulaire de creation. */
export const CATEGORIES = ["Design", "CSS", "UX", "React", "Performance"];
