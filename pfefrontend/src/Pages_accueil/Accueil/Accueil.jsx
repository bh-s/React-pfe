import { NavLink } from "react-router-dom";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import bg from "../../components/images/bg.jpg";
import "./Accueil.css";

function Accueil() {
  return (
    <div
      className="background-container"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      <div className="centered-text">
        <h1>Plateforme Universitaire des Marchés Publics</h1>
        <p className="paragraphe">
          Découvrez toutes les opportunités d'approvisionnement de l'Université
          Hassiba Benbouali en un seul endroit. Accédez facilement aux appels
          d'offres et sécurisez vos contrats.
        </p>

        <div className="cta-buttons">
          <NavLink to="/Annonces" className="cta-button cta-primary">
            <FaSearch />
            Voir les Appels d'Offres
          </NavLink>
          <a href="#presentation" className="cta-button cta-secondary">
            En Savoir Plus
            <FaArrowRight />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Accueil;
