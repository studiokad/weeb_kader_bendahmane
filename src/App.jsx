import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Article from "./pages/Article/Article";
import ArticleNew from "./pages/ArticleNew/ArticleNew";
import Blog from "./pages/Blog/Blog";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";

/**
 * Table de routage de l'application.
 *
 * Toutes les routes sont imbriquees dans <Layout>, qui fournit l'en-tete et le
 * pied de page communs ; seul le contenu central change d'une page a l'autre.
 *
 * L'ordre compte : "/blog/nouveau" est declare AVANT "/blog/:slug", sinon
 * react-router interpreterait "nouveau" comme le slug d'un article.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/nouveau" element={<ArticleNew />} />
          <Route path="/blog/:slug" element={<Article />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
