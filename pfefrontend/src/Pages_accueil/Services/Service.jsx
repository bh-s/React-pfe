"use client";

import { useEffect } from "react";
import bg from "../../components/images/pre.jpg";
import AOS from "aos";
import "./Service.css";

function Service() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out",
    });
  }, []);

  return (
    <section id="services" className="services-section">
      <img
        src={bg || "/placeholder.svg"}
        className="services-background"
        alt="Background"
      />
      <div className="services-overlay"></div>

      <div className="text-cnr">
        <h1 className="title" data-aos="fade-up">
          NOS SERVICES
        </h1>
        <p className="text2" data-aos="fade-up" data-aos-delay="200">
          Notre plateforme vous offre la possibilité de rester informé en
          quelques clics de tous les appels d'offres pertinents pour vos
          secteurs d'activité, ainsi que des annonces importantes telles que
          <b> Avis de prorogation de délais</b>,{" "}
          <b>Avis d'annulation ou d'infructuosité</b>, <b>Avis d'attribution</b>
          .
        </p>
      </div>

      <div className="card-container2">
        <div className="service-card" data-aos="fade-up" data-aos-delay="300">
          <div className="service-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="service-card-title">Veille des Appels d'Offres</h2>
          <p className="service-card-description">
            Ne manquez plus aucun appel d'offres pertinent pour votre secteur
            d'activité. Nous surveillons en temps réel les opportunités
            disponibles et vous alertons instantanément.
          </p>
        </div>

        <div className="service-card" data-aos="fade-up" data-aos-delay="400">
          <div className="service-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 13H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 9H9H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="service-card-title">Gestion des Appels d'Offres</h2>
          <p className="service-card-description">
            Facilitez la gestion de vos appels d'offres avec notre plateforme
            intuitive. Organisez, suivez et analysez tous vos projets en cours
            pour maximiser vos chances de succès.
          </p>
        </div>

        <div className="service-card" data-aos="fade-up" data-aos-delay="500">
          <div className="service-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="9"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7071C21.7033 16.0601 20.9999 15.6182 20.2 15.4373"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 3.13C16.8003 3.31092 17.5037 3.75283 18.0098 4.39987C18.5159 5.04691 18.8004 5.85726 18.8004 6.69266C18.8004 7.52807 18.5159 8.33842 18.0098 8.98546C17.5037 9.6325 16.8003 10.0744 16 10.2553"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="service-card-title">Accompagnement Personnalisé</h2>
          <p className="service-card-description">
            Bénéficiez d'un accompagnement personnalisé tout au long de votre
            processus d'appels d'offres. Notre équipe d'experts est là pour
            répondre à vos questions et vous aider à optimiser vos soumissions.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Service;
