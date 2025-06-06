"use client";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-icon">
          <FaExclamationTriangle />
        </div>

        <div className="error-code">404</div>

        <h1 className="not-found-title">Page Introuvable</h1>

        <p className="not-found-message">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <div className="not-found-actions">
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            <FaHome />
            Retour à l'Accueil
          </button>

          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <FaArrowLeft />
            Page Précédente
          </button>
        </div>

        <div className="help-text">
          <p>Besoin d'aide ? Contactez notre support technique</p>
          <a href="mailto:support@uhbc.edu.dz" className="support-link">
            support@uhbc.edu.dz
          </a>
        </div>
      </div>

      <div className="background-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
    </div>
  );
}

export default NotFound;
