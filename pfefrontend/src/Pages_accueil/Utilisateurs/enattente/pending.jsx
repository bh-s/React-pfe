import { FaHourglassHalf, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import "./pending.css";

function Pending() {
  return (
    <div className="pending-container">
      <div className="pending-content">
        <div className="pending-icon">
          <FaHourglassHalf />
        </div>

        <h1 className="pending-title">Compte en Attente de Validation</h1>

        <p className="pending-message">
          Votre demande d'inscription a été reçue avec succès. Votre compte est
          actuellement en cours de validation par notre équipe administrative.
        </p>

        <div className="status-steps">
          <div className="step completed">
            <FaCheckCircle />
            <span>Inscription soumise</span>
          </div>
          <div className="step active">
            <FaHourglassHalf />
            <span>En cours de validation</span>
          </div>
          <div className="step">
            <FaEnvelope />
            <span>Notification par email</span>
          </div>
        </div>

        <div className="info-box">
          <h3>Que se passe-t-il maintenant ?</h3>
          <ul>
            <li>Notre équipe examine votre demande</li>
            <li>Vous recevrez un email de confirmation</li>
            <li>Le processus prend généralement 24-48 heures</li>
          </ul>
        </div>

        <div className="contact-info">
          <p>Des questions ? Contactez-nous :</p>
          <a href="mailto:admin@uhbc.edu.dz" className="contact-link">
            admin@uhbc.edu.dz
          </a>
        </div>
      </div>
    </div>
  );
}

export default Pending;
