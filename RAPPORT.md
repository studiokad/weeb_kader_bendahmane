# Rapport technique — Site Weeb

**Auteur** : Kader Bendahmane
**Projet** : site vitrine + blog + authentification (semaine 1)
**Dépôt** : [github.com/studiokad/weeb_kader_bendahmane](https://github.com/studiokad/weeb_kader_bendahmane)
**Stack** : React 19, Vite 8, React Router 7, CSS Modules

---

## 1. Vue d'ensemble

L'application est une **SPA** (*single page application* : une seule page HTML, dont le contenu change sans rechargement). Le serveur envoie un document vide, React construit l'interface, et React Router remplace le contenu central à chaque navigation.

Sept routes sont livrées :

| Route | Page | Statut |
|---|---|---|
| `/` | Home | Demandée — maquette |
| `/contact` | Contact | Demandée — maquette |
| `/login` | Login | Demandée — maquette |
| `/blog` | Liste des articles | Anticipée — design libre |
| `/blog/:slug` | Gabarit d'article | Anticipée — design libre |
| `/blog/nouveau` | Ajout d'un article | Anticipée — design libre |
| `*` | 404 | Ajoutée |

---

## 2. Fidélité à la maquette

Le parti pris visuel du client est un **site sombre au pied de page clair**, avec un violet vif comme unique couleur d'accent et une barre de navigation flottante en pilule.

### Les couleurs ont été relevées, pas estimées

Plutôt que d'approcher les teintes à l'œil, les valeurs ont été **échantillonnées au pixel** dans les PNG de la maquette (dossier `/maquette`) :

| Rôle | Valeur | Repère |
|---|---|---|
| Fond de page | `#0f172a` | bleu nuit |
| Barre de navigation | `#181e2d` | |
| Carte de formulaire | `#21223f` | indigo sombre |
| Accent — boutons | `#9333ea` | violet |
| Accent — mots mis en avant | `#c084fc` | violet clair |
| Libellé de champ | `#986bcd` | |
| Bordure de champ | `#70539d` | |
| Forme géométrique | `#be185d` | magenta |
| Texte secondaire | `#dbeafe` | bleu très clair |
| Pied de page | `#ffffff` | |
| Intitulés de colonnes | `#afbaca` | |

Toutes ces valeurs vivent dans **`src/styles/tokens.css`** et nulle part ailleurs.

### Le renversement clair / sombre

Le pied de page est la seule zone claire d'un site sombre. Plutôt que d'écrire des couleurs en dur dans `Footer.module.css`, une classe utilitaire **`.surface-light`** redéfinit les tokens pour ce bloc :

```css
.surface-light {
  --color-bg: var(--surface-light-bg);
  --color-text: var(--surface-light-text);
  --color-text-muted: var(--surface-light-muted);
}
```

Les composants enfants n'ont rien à savoir : ils lisent les mêmes noms de tokens et se recolorent seuls. Le même mécanisme servirait à poser une section claire ailleurs dans le site.

### Ce qui a été retiré

Une bande défilante avait d'abord été ajoutée entre les logos de références et la section « Apprenez et progressez ». Elle a été **supprimée** : la maquette enchaîne directement ces deux blocs, et un élément d'initiative ne doit pas s'intercaler dans une séquence que le client a dessinée. Le composant a été retiré du dépôt plutôt que laissé inutilisé — un composant que rien n'importe est du code mort, et il finit par tromper la lecture.

### Élément déduit

La maquette de la page Contact montre le **troisième champ en état de focus**, cadre complet et curseur visible — son libellé est donc masqué. Sa position, entre *Prénom* et *Email*, désigne un **Téléphone** : c'est le choix retenu, et le champ est facultatif. C'est la seule interprétation du rapport ; tout le reste est lu directement sur la maquette.

---

## 3. Architecture des dossiers

```
src/
├── main.jsx                 Point d'entrée : monte React et charge les styles
├── App.jsx                  Table de routage
│
├── styles/                  Styles globaux, chargés une seule fois
│   ├── tokens.css           Variables CSS relevées sur la maquette
│   ├── reset.css            Neutralisation des styles navigateur
│   └── global.css           Conteneurs, .surface-light, accessibilité
│
├── components/
│   ├── layout/              Structure de page, présente sur toutes les routes
│   │   ├── Layout.jsx       Coquille : header + contenu + footer
│   │   ├── Header/          Barre flottante + panneau mobile
│   │   └── Footer/          Surface claire, 4 colonnes, réseaux sociaux
│   └── ui/                  Briques réutilisables, sans logique métier
│       ├── Button/          3 variantes : plein, contour, discret
│       ├── Field/           Input, textarea et select unifiés
│       ├── BrowserMockup/   Fenêtre de navigateur factice, 100 % CSS
│       ├── SectionTitle/
│       ├── ArticleCard/
│       └── Slider/          Carrousel
│
├── pages/                   Un dossier par route
│   ├── Home/ Contact/ Login/ Blog/ Article/ ArticleNew/ NotFound/
│
├── hooks/                   Logique React réutilisable
│   ├── useForm.js           Valeurs, erreurs, validation, envoi
│   └── useArticles.js       Chargement des articles
│
├── services/
│   └── articlesApi.js       Seul point d'accès aux données
│
├── utils/
│   └── formatDate.js        Formatage de date en français
│
└── data/
    └── articles.seed.json   Articles de démonstration
```

### Les trois principes qui structurent ce découpage

**1. Un composant = un dossier = deux fichiers.** `Button.jsx` et `Button.module.css` vivent côte à côte. Supprimer un composant, c'est supprimer un dossier : aucun style orphelin ne subsiste ailleurs.

**2. `components/` ne connaît pas le métier, `pages/` ne connaît pas le style.** Un composant de `ui/` ignore qu'il existe un blog ; une page assemble des briques et gère l'état de son écran. Cette séparation est ce qui permet de réutiliser `Field` à l'identique dans Contact, Login et Ajout d'article.

**3. Les données passent par un seul point.** Aucune page ne lit `articles.seed.json`. Tout passe par `services/articlesApi.js` — voir section 6.

---

## 4. Bibliothèques installées

Le projet compte **une seule dépendance de production** en plus de React.

| Paquet | Rôle | Pourquoi celui-ci |
|---|---|---|
| `react` / `react-dom` | Bibliothèque d'interface | Imposé par le client |
| `react-router-dom` | Navigation entre les pages | Standard de fait pour une SPA React. Gère l'URL, le bouton retour du navigateur et les paramètres d'adresse (`/blog/:slug`) |
| `vite` (dev) | Serveur de développement et build | Démarre en ~300 ms, recharge à chaud, et produit un build optimisé sans configuration |
| `@vitejs/plugin-react` (dev) | Support JSX et Fast Refresh | Requis par Vite pour React |
| `oxlint` (dev) | Analyse statique du code | Fourni par le template Vite. Détecte les erreurs de hooks React |

### Ce que je n'ai volontairement pas installé, et pourquoi

**Pas de framework CSS (Tailwind, Bootstrap).** L'examen est noté sur la fidélité au design. Un fichier de tokens plus des CSS Modules donnent un contrôle exact sur chaque valeur relevée dans la maquette, sans classes utilitaires empilées dans le JSX. Le CSS produit pèse **7,3 ko compressés** pour tout le site.

**Pas de bibliothèque de formulaires (Formik, React Hook Form).** Trois formulaires seulement, avec des règles simples. Le hook `useForm.js` fait 120 lignes, je le maîtrise entièrement, et il montre la compréhension des états de formulaire mieux qu'un appel de bibliothèque.

**Pas de bibliothèque de carrousel (Swiper, Slick).** `Slider.jsx` gère les flèches, les points, le clavier, le glisser tactile et la lecture automatique en 180 lignes. Les paquets existants apportent 40 ko pour trois diapositives.

**Pas de bibliothèque d'animation (Framer Motion).** Les transitions demandées (survol, focus, apparition) sont couvertes par `transition` et `@keyframes` en CSS, qui s'exécutent sur le processeur graphique.

**Aucune image.** Les fenêtres de navigateur, les logos de références, les icônes de réseaux sociaux et les formes géométriques de la maquette sont **dessinés en CSS et en SVG**. Ils restent nets sur tous les écrans, suivent la couleur du texte, et le site ne charge aucun fichier d'image.

> Le principe suivi : chaque dépendance est une dette. On l'ajoute quand elle résout un problème qu'on ne sait pas résoudre proprement soi-même, pas par réflexe.

---

## 5. Fonctionnement global

### Chaîne de démarrage

```
index.html          →  fournit <div id="root"> et charge main.jsx
   ↓
main.jsx            →  importe global.css, monte <App/> dans #root
   ↓
App.jsx             →  <BrowserRouter> lit l'URL, choisit la route
   ↓
Layout.jsx          →  affiche Header + <Outlet/> + Footer
   ↓
<Outlet/>           →  la page correspondant à l'URL
```

`Layout` étant le parent de toutes les routes, l'en-tête et le pied de page ne sont **jamais remontés** lors d'une navigation : seul le centre change. C'est aussi lui qui remonte la page en haut à chaque changement d'URL — un navigateur ne le fait pas tout seul en SPA.

### Ordre des routes : un piège évité

```jsx
<Route path="/blog/nouveau" element={<ArticleNew />} />
<Route path="/blog/:slug"   element={<Article />} />
```

Si `:slug` était déclaré en premier, l'adresse `/blog/nouveau` serait comprise comme « l'article dont le slug est *nouveau* », et la page d'ajout deviendrait inatteignable.

### Cycle d'un formulaire

Les trois formulaires partagent `useForm.js` :

1. **Saisie** → `handleChange` met la valeur à jour. Aucune erreur n'est affichée.
2. **Sortie du champ** (`blur`) → le champ est marqué « visité », la validation s'exécute, l'erreur apparaît si besoin.
3. **Correction** → un champ déjà en erreur est revalidé à chaque frappe : l'erreur disparaît dès que c'est corrigé.
4. **Envoi** → tous les champs deviennent « visités ». S'il reste une erreur, l'envoi est bloqué. Sinon l'écran de confirmation remplace le formulaire.

> Le choix central : **on n'affiche jamais « champ requis » pendant que l'utilisateur tape**. Lui reprocher un champ vide qu'il est en train de remplir est une faute d'expérience utilisateur.

### Chargement des données

`useArticles` expose trois états — chargement, erreur, données — et chacun a son rendu à l'écran : squelettes animés, message d'erreur avec bouton *Réessayer*, ou la liste. Il n'existe aucun cas où l'utilisateur voit un écran vide sans explication.

---

## 6. La couche de données : préparer la base sans l'avoir

L'énoncé autorise une API avant la vraie base de données. Plutôt que de lire le JSON directement dans les pages, tout passe par `services/articlesApi.js`, qui expose quatre fonctions **asynchrones** :

```js
fetchArticles()          // liste, triée du plus récent au plus ancien
fetchArticleBySlug(slug) // un article, ou null
createArticle(draft)     // création, rejette si le titre existe déjà
slugify(title)           // "Créer un design system" → "creer-un-design-system"
```

L'implémentation actuelle stocke dans le `localStorage` du navigateur et **simule une latence réseau de 400 ms**. Ce détail n'est pas cosmétique : sans lui, les états de chargement ne seraient jamais visibles et on ne saurait pas s'ils fonctionnent.

**Le bénéfice du découpage** : brancher une vraie API se fait en réécrivant ces quatre fonctions en `fetch()`. Tant qu'elles gardent leur signature et renvoient des promesses, **aucun composant ne change**. Les pages ignorent déjà d'où viennent les données.

Les articles créés depuis `/blog/nouveau` sont réellement persistés et réapparaissent après un rechargement.

---

## 7. Responsive

**Approche mobile d'abord** : le style de base vise le mobile, les media queries n'ajoutent que ce qui change en montant en taille.

Trois techniques évitent de multiplier les points de rupture :

**`clamp()` pour la typographie.** `--fs-3xl: clamp(2.3rem, 1.4rem + 4vw, 4.2rem)` — le titre d'accueil grandit continûment entre 375 px et 1440 px. Aucune media query.

**`auto-fit` pour les grilles.** `repeat(auto-fill, minmax(min(100%, 320px), 1fr))` — le navigateur déduit le nombre de colonnes de la place disponible. Le `min(100%, 320px)` empêche tout débordement horizontal sur les très petits écrans.

**Espacements fluides.** `--section-y: clamp(3.5rem, 2rem + 7vw, 7.5rem)` — le rythme vertical s'adapte sans palier.

Les media queries sont donc réservées aux **vraies bascules de mise en page** :

| Seuil | Ce qui change |
|---|---|
| `640px` | Le formulaire de contact passe sur deux colonnes ; le pied de page passe de 1 à 2 colonnes |
| `900px` | La navigation passe du panneau déroulant à la barre horizontale |
| `1024px` | Les sections texte/visuel de l'accueil passent côte à côte, avec inversion de l'ordre sur la seconde ; le pied de page passe à 5 colonnes |

**Cibles tactiles** : tous les éléments interactifs font au moins **44 px** de haut. Les points du carrousel mesurent 10 px visuellement mais leur zone cliquable fait 44 px.

---

## 8. Animations et interactions

| Élément | Effet |
|---|---|
| Liens de navigation | Soulignement violet qui se déploie de gauche à droite |
| Boutons | Élévation de 2 px + halo violet au survol |
| Champs de formulaire | Au repos un simple trait ; **au focus, cadre complet, coins arrondis et libellé qui remonte** — l'état exact montré par la maquette |
| Menu mobile | Trois barres qui se replient en croix, panneau qui se déplie sous la barre |
| Titre d'accueil | Trait violet sous « facettes » qui se dessine au chargement |
| Fenêtre de navigateur | Monte en fondu à l'arrivée sur la page |
| Formes géométriques | La pile de carrés s'ouvre en éventail au survol |
| Logos de références | Passent au violet clair et montent au survol |
| Carrousel | Glissement de 500 ms, pause au survol, au focus et quand l'onglet passe en arrière-plan |
| Cartes d'articles | Montée de 6 px, bordure accentuée, couverture zoomée |
| Chargement | Squelettes en dégradé animé |

**Deux règles tenues partout :**

Seules `transform` et `opacity` sont animées. Ces deux propriétés sont traitées par le processeur graphique ; animer `width` ou `top` forcerait un recalcul de mise en page à chaque image.

`prefers-reduced-motion` est respecté : la préférence système « réduire les animations » coupe toutes les transitions. Pour une partie des utilisateurs, ce n'est pas un confort mais une nécessité.

---

## 9. Éléments ajoutés (« pour aller plus loin »)

Non demandés par la maquette, mais cohérents avec l'univers du projet :

- **Carrousel « À la une »** en tête du blog — flèches, points, clavier, glisser tactile et lecture automatique, sans dépendance ;
- **Champ mot de passe à bascule** (œil afficher/masquer) sur la page de connexion ;
- **Aperçu en direct** dans la page de publication : la carte du blog se construit au fil de la saisie ;
- **Squelettes de chargement** plutôt qu'un écran vide ;
- **Page 404** avec le chiffre en dégradé violet ;
- **Filtres par catégorie** sur le blog, déduits des articles réellement présents.

---

## 10. Accessibilité

- Lien d'évitement en premier élément focusable
- Un seul `<h1>` par page, hiérarchie de titres continue
- `aria-invalid` + `role="alert"` sur les erreurs, liées au champ par `aria-describedby`
- `aria-expanded` / `aria-controls` sur le bouton du menu, `Échap` pour fermer
- `inert` sur le menu fermé et les diapositives masquées : elles sortent du parcours clavier
- Carrousel pilotable aux flèches du clavier
- Anneau de focus visible sur tout élément interactif (`:focus-visible`)
- Éléments décoratifs marqués `aria-hidden="true"` — la fenêtre de navigateur factice en entier

---

## 11. Prise en main du code

### Démarrer

```bash
cd weeb_kader_bendahmane
npm install
npm run dev      # http://localhost:5173
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement, rechargement à chaud |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Sert le build de production localement |
| `npm run lint` | Analyse statique (0 avertissement) |

### Compte de démonstration

Page `/login` : `demo@weeb.fr` / `weeb2026`. Toute autre combinaison affiche le message d'erreur — les deux chemins sont exerçables.

### Où intervenir selon le besoin

| Vous voulez… | Fichier |
|---|---|
| Changer une couleur, une taille, un espacement | `src/styles/tokens.css` **uniquement** |
| Ajouter une page | Créer `src/pages/MaPage/`, puis une `<Route>` dans `App.jsx` |
| Ajouter un lien de menu | Tableau `NAV_LINKS` en haut de `Header.jsx` |
| Modifier le pied de page | Tableaux `COLUMNS` et `SOCIALS` en haut de `Footer.jsx` |
| Modifier une référence, un texte de section | Tableaux en haut de `Home.jsx` |
| Brancher une vraie API | `src/services/articlesApi.js`, les 4 fonctions |
| Changer une règle de validation | Fonction `validateXxx` en haut de la page concernée |
| Poser une section claire dans une page sombre | Classe `surface-light` sur le bloc |

> **La règle à retenir** : aucune couleur ni taille n'est écrite en dur dans un composant. Tout passe par une variable de `tokens.css`. Changer l'identité visuelle du site = modifier un seul fichier.

### Conventions de nommage

| Type | Convention | Exemple |
|---|---|---|
| Composant | PascalCase | `ArticleCard.jsx` |
| Hook | `use` + camelCase | `useArticles.js` |
| Fonction, variable | camelCase | `handleSubmit`, `visibleArticles` |
| Constante fixe | SCREAMING_SNAKE_CASE | `NAV_LINKS`, `MIN_MESSAGE_LENGTH` |
| Classe CSS | camelCase (CSS Modules) | `styles.formCard` |
| Variable CSS | kebab-case préfixé | `--color-accent`, `--fs-lg` |

### Ce que les commentaires disent — et ne disent pas

Les commentaires du projet expliquent **pourquoi**, jamais **quoi**. `// on incrémente i` n'apporte rien ; en revanche le lecteur ne peut pas deviner seul pourquoi les diapositives masquées du carrousel portent `inert`, pourquoi `/blog/nouveau` est déclaré avant `/blog/:slug`, pourquoi la pastille de catégorie ne suit pas `--color-text`, ou pourquoi les erreurs n'apparaissent qu'après le premier `blur`. Ce sont ces décisions-là qui sont commentées.

---

## 12. Workflow Git

Le dépôt n'a pas été rempli d'un bloc : chaque lot de travail a suivi la séquence demandée
par l'énoncé — **issue → branche → modifications → Pull Request → validation → suppression
de la branche**. Douze issues, douze branches, douze Pull Requests fusionnées.

| # | Branche | Contenu |
|---|---|---|
| 1 | `chore/project-setup` | React, Vite, oxlint, point d'entrée HTML |
| 2 | `feat/design-system` | reset, jetons de couleur et de typographie, styles globaux |
| 3 | `feat/ui-components` | `Button`, `Field`, `SectionTitle` |
| 4 | `feat/layout` | en-tête flottant, pied de page clair, gabarit commun |
| 5 | `feat/home-page` | page Home + mise en place du routage |
| 6 | `feat/contact-page` | page Contact + hook de formulaire partagé |
| 7 | `feat/login-page` | page Login |
| 8 | `feat/blog-page` | liste des articles, service de données, carrousel |
| 9 | `feat/article-page` | template d'article |
| 10 | `feat/article-creation-page` | ajout d'un article |
| 11 | `feat/not-found-page` | page 404 |
| 12 | `docs/project-report` | ce rapport et le README |

**Les règles tenues d'un bout à l'autre**

- **Nommage des branches** : `<type>/<sujet>`, en minuscules, mots séparés par des tirets.
  Le type reprend celui du commit — `feat`, `chore`, `docs`.
- **Messages de commit** : *Conventional Commits*, rédigés en anglais comme l'exemple donné
  dans l'énoncé (`feat: add login form`).
- **Une Pull Request ferme son issue** grâce à la mention `Closes #N` dans sa description :
  la fusion clôt l'issue automatiquement, l'une ne peut pas survivre à l'autre.
- **Fusion par *merge commit***, jamais par écrasement. L'historique garde ainsi la trace
  des branches ; `git log --graph` montre le découpage réel du travail.
- **Branche supprimée après fusion**, localement et sur GitHub.
- **Aucun commit direct sur `main`** en dehors du commit d'initialisation du dépôt.

**L'ordre des lots n'est pas arbitraire.** Les fondations viennent d'abord (configuration,
styles, composants communs), les pages ensuite. Le routage n'apparaît qu'au lot 5, avec la
première vraie page : déclarer une route vers un écran qui n'existe pas encore aurait produit
une branche qui ne compile pas.

**Chaque branche a été vérifiée avant d'ouvrir sa Pull Request** : `npm run lint` et
`npm run build` doivent passer. Aucune PR n'a été ouverte sur du code qui ne compile pas —
c'est ce qui permet de repartir de n'importe quel commit de `main` et d'obtenir un site qui
fonctionne.

---

## 13. Vérifications effectuées

| Contrôle | Résultat |
|---|---|
| `npm run build` | ✅ 0 erreur — CSS 7,3 ko et JS 88 ko compressés |
| `npm run lint` | ✅ 0 erreur, 0 avertissement |
| Rendu des 7 routes | ✅ Chaque page affiche le bon `<h1>` |
| Route dynamique `/blog/:slug` | ✅ L'article est chargé depuis la couche de données |
| Route inconnue et slug inconnu | ✅ Pages 404 et « article introuvable » distinctes |
| Tokens CSS | ✅ Aucune variable utilisée sans être définie |
| Composants orphelins | ✅ Aucun — les 7 composants `ui/` sont importés |
| Encodage | ✅ Aucun caractère mal encodé dans les sources |
| Rendu 320 px | ✅ Aucun débordement horizontal |
| Rendu 394 / 768 / 1440 px | ✅ Les trois bascules de mise en page se déclenchent |
| Comparaison à la maquette | ✅ Accueil, Contact (desktop + mobile) et Login confrontés capture par capture |

---

## 14. Limites connues

Points assumés à ce stade, à traiter dans les semaines suivantes :

- **Pas d'authentification réelle.** Le compte de démonstration est en clair dans `Login.jsx`. Il disparaîtra avec le branchement d'un vrai serveur.
- **Pas de session persistée.** Une connexion réussie affiche un message mais ne crée pas de session.
- **Données en `localStorage`.** Propres à un navigateur, non partagées. C'est le rôle de la base de données prévue.
- **Formulaire de contact non transmis.** L'envoi est simulé ; il faudra un point d'entrée serveur.
- **Maquette desktop partielle.** Le client a fourni l'accueil en desktop, le contact en desktop et mobile, la connexion en mobile. Les vues manquantes (accueil mobile, connexion desktop) ont été composées à partir des règles observées sur les autres écrans.
