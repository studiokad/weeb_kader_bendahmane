# Weeb — site vitrine, blog et authentification

Site de l'entreprise **Weeb** : partie vitrine, blog et espace d'authentification.
Projet réalisé dans le cadre du cursus Software Engineer — semaine 1.

Interface sombre à accent violet, pied de page clair, barre de navigation
flottante — intégrée d'après la maquette du client (`/maquette`), dont les
couleurs ont été relevées au pixel plutôt qu'estimées.

**Auteur** : Kader Bendahmane
**Dépôt** : https://github.com/studiokad/weeb_kader_bendahmane

---

## Stack

| | |
|---|---|
| Bibliothèque UI | React 19 |
| Build | Vite 8 |
| Navigation | React Router 7 |
| Styles | CSS Modules + variables CSS |
| Lint | oxlint |

---

## Installation

```bash
npm install
npm run dev
```

Le site est servi sur **http://localhost:5173**.

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Prévisualisation du build |
| `npm run lint` | Analyse statique |

---

## Pages

| Route | Page |
|---|---|
| `/` | Accueil |
| `/contact` | Contact |
| `/login` | Connexion |
| `/blog` | Liste des articles |
| `/blog/:slug` | Article |
| `/blog/nouveau` | Publier un article |
| *(autre)* | Page 404 |

**Compte de démonstration** — page `/login` : `demo@weeb.fr` / `weeb2026`

---

## Éléments ajoutés

Non demandés par la maquette, et placés hors des séquences qu'elle dessine :
carrousel « À la une » en tête du blog, champ mot de passe à bascule, aperçu
en direct dans la page de publication, squelettes de chargement, filtres par
catégorie, page 404.

Le site ne charge **aucun fichier image** : fenêtres de navigateur, logos,
icônes et formes géométriques sont dessinés en CSS et en SVG.

---

## Documentation

Le rapport technique complet — architecture des dossiers, bibliothèques
retenues et écartées, fonctionnement de l'application et prise en main du
code — se trouve dans **[RAPPORT.md](./RAPPORT.md)**.

---

## Convention de commits

Le projet suit les *Conventional Commits* :

```
feat:     nouvelle fonctionnalité
fix:      correction de bug
style:    mise en forme, CSS
refactor: réorganisation sans changement de comportement
docs:     documentation
chore:    configuration, dépendances
```

## Workflow Git

Chaque lot de travail a suivi la même séquence :

```
issue → branche → modifications → Pull Request → validation → fusion → suppression de la branche
```

Douze issues, douze branches, douze Pull Requests. Les branches sont nommées
`<type>/<sujet>` (`feat/login-page`, `chore/project-setup`), chaque Pull Request
ferme son issue par un `Closes #N`, et la fusion se fait par *merge commit* pour
que l'historique garde la trace du découpage.

`main` ne reçoit aucun commit direct en dehors de l'initialisation du dépôt.
Le détail lot par lot est dans le [rapport](./RAPPORT.md#12-workflow-git).
