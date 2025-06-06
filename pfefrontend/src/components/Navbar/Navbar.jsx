"use client";

import { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../images/Frame 8 (3).jpg";
import "./Navbar.css";
import Accueil from "../../Pages_accueil/Accueil/Accueil";
import Presentation from "../../Pages_accueil/Services/Presentation";
import Service from "../../Pages_accueil/Services/Service";
import Footer from "../Footer/Footer";
import "./Navbar.css";
import { HamburgetMenuClose, HamburgetMenuOpen } from "./Icons";

function NavBar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setClick(false); // Close mobile menu after clicking
  };

  return (
    <>
      <div className="top-nav">
        <div className="top-nav-content">
          <div className="contact-info">
            <span>
              <FaPhoneAlt /> +213 (0)27727061
            </span>
            <span>
              <FaPhoneAlt /> +213 (0)44 35 49 78
            </span>
          </div>
          <select className="selectLang">
            <option>Langue</option>
            <option>Arabe</option>
            <option>Français</option>
          </select>
        </div>
      </div>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            <img src={logo || "/placeholder.svg"} alt="uhbc" className="logo" />
          </NavLink>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <button
                className="nav-links nav-button"
                onClick={() => scrollToSection("accueil")}
              >
                Accueil
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-links nav-button"
                onClick={() => scrollToSection("presentation")}
              >
                Présentation
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-links nav-button"
                onClick={() => scrollToSection("services")}
              >
                Services
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-links nav-button"
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </button>
            </li>
          </ul>
          <div className="nav-icons">
            <div className="nav-icon" onClick={handleClick}>
              {click ? (
                <span className="icon">
                  <HamburgetMenuClose />
                </span>
              ) : (
                <span className="icon">
                  <HamburgetMenuOpen />
                </span>
              )}
            </div>
            <div className="login-register-buttons">
              <div className="button-container">
                <NavLink to="/login">
                  <button type="button" className="auth-btn login-btn">
                    Connexion
                  </button>
                </NavLink>
                <NavLink to="/signup">
                  <button type="button" className="auth-btn register-btn">
                    Inscription
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div id="accueil">
        <Accueil />
      </div>
      <div id="presentation">
        <Presentation />
      </div>
      <div id="services">
        <Service />
      </div>
      <div id="contact">
        <Footer />
      </div>
    </>
  );
}

export default NavBar;
