"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import pre from "../../components/images/rectorat_UHBC.jpg";
import "./Presentation.css";

function Presentation() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out",
    });
  }, []);

  return (
    <section id="presentation" className="presentation-section">
      <div className="container2" data-aos="fade-up">
        <div className="text">
          <h2 className="title">QUI SOMMES-NOUS ?</h2>
          <p className="intro-text">
            <strong>L'Université Hassiba Benbouali de Chlef</strong> vous
            propose une plateforme moderne et efficace qui facilite l'accès aux
            marchés publics et privés en Algérie.
          </p>
          <p>
            Notre système assure un suivi complet du cycle de vie des projets,
            incluant les avis d'appels d'offres, les attributions, annulations,
            échecs d'attribution, mises en demeure, résiliations et prorogations
            de délais.
          </p>
          <p>
            Notre équipe de professionnels expérimentés en veille économique
            vous accompagne dans la recherche et l'obtention de vos marchés en
            Algérie.
          </p>

          <div
            className="stats-container"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Appels d'Offres</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Entreprises</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Années d'Expérience</span>
            </div>
          </div>
        </div>
        <div className="image" data-aos="fade-left" data-aos-delay="300">
          <img
            src={pre || "/placeholder.svg"}
            alt="Université Hassiba Benbouali de Chlef"
          />
        </div>
      </div>
    </section>
  );
}

export default Presentation;
