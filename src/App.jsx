import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";

/**
 * Table de routage de l'application.
 *
 * Toutes les routes sont imbriquees dans <Layout>, qui fournit l'en-tete et le
 * pied de page communs ; seul le contenu central change d'une page a l'autre.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
