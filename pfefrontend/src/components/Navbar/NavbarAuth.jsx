"use client";

import { useState, useEffect } from "react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import logo from "../images/Frame 8 (3).jpg";
import { HamburgetMenuClose, HamburgetMenuOpen } from "./Icons";
import { FaPhoneAlt } from "react-icons/fa";

function NavBar() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const history = useNavigate();
  const [name, setName] = useState("");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    history("/");
    window.location.reload();
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setClick(false);
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
          <NavLink to="/home" className="nav-logo">
            <img src={logo || "/placeholder.svg"} alt="uhbc" className="logo" />
          </NavLink>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink to="/home" className="nav-links" onClick={handleClick}>
                Accueil
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/Annonces"
                className="nav-links"
                onClick={handleClick}
              >
                Appels d'Offres
              </NavLink>
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
            <div className="user-menu">
              <Menu>
                <MenuButton as="div" className="user-profile">
                  <div className="user-info">
                    <FaUser className="user-icon" />
                    <span className="user-name">{name}</span>
                  </div>
                  <Avatar
                    size="sm"
                    bg="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                    color="white"
                    name={name}
                  />
                </MenuButton>

                <MenuList className="user-dropdown">
                  <MenuItem className="user-email">
                    <div className="email-info">
                      <FaUser />
                      <span>{email}</span>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleLogout} className="logout-item">
                    <div className="logout-info">
                      <FaSignOutAlt />
                      <span>Déconnexion</span>
                    </div>
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
