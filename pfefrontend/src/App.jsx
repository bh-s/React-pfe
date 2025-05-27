// import './App.css'
import Home from "./Pages_accueil/Home/Home"
import Login from "./Pages_accueil/Utilisateurs/Login/Login"
import Signup from "./Pages_accueil/Utilisateurs/Register/Register"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import Navbar from "./components/Navbar/Navbar";
import Besoins from "./Pages_administrateur/Designation/CreerProjet/Creer_projet";
import Data from "./Pages_administrateur/Designation/CahierdeCharge/Cahier _de_charge"
import Blog from "./Pages_administrateur/Blog_bugetaire/Blog_bugetaire";
import Pending from "./Pages_accueil/Utilisateurs/enattente/pending";
import PendingUsers from "./Pages_administrateur/Utilisaeurs/Utilisateurs";
import Appel from "./Pages_administrateur/Annance/Lancer_Annance";
import Annonce from "./Pages_accueil/Annonces/Annonce";
import NotFound from "./notFoundPage/NotFound";
import Page from "./Pages_administrateur/Ouverture_et_evaluation_des_offres/Page";
import Ouverture from "./Pages_administrateur/Ouverture_et_evaluation_des_offres/Ouverture";
import Evaluation from "./Pages_administrateur/Ouverture_et_evaluation_des_offres/Evaluation";
import Rapport from "./Pages_administrateur/Rapport_de_presentation/Rapport";
import PageRapport from "./Pages_administrateur/Rapport_de_presentation/Page";
function App() {
  return (
    <div className="App">

      <Router>
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Annonces" element={<Annonce />} />
          <Route path="/admin" element={<Besoins />} />
          <Route path="/besoins" element={<Besoins />} />
          <Route path="data" element={<Data />} />
          <Route path="/Blog" element={<Blog />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/pending-users" element={<PendingUsers />} />
          <Route path="/Appel_d_offre" element={<Appel />} />
          <Route path="/rapport-projects" element={<PageRapport />} />
          <Route path="/rapport/:projectName" element={<Rapport />} />
          <Route path="/rapport_de_presentation" element={<Rapport />} />
          <Route path="/ouverture_et_evaluation_des_offres" element={< Page />} />
          <Route path="/ouverture_et_evaluation_des_offres/:projectName/ouverture" element={<Ouverture />} />
          <Route path="/ouverture_et_evaluation_des_offres/:projectName/evaluation" element={<Evaluation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;