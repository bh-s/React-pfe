"use client";

import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useColorModeValue } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { useColorMode } from "@chakra-ui/react";
import logo from "../images/Frame 8 (3).jpg";
import "./sidebar.css";

const Sidebar = () => {
  const { colorMode } = useColorMode();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const HumbiconColor = useColorModeValue("#A0AEC0", "white");

  // Define menu categories and items
  const menuCategories = [
    {
      title: "GESTION DES PROJETS",
      items: [
        { path: "/besoins", name: "Désignation", icon: "»" },
        {
          path: "/ouverture_et_evaluation_des_offres",
          name: "Procès-verbal d'ouverture et évaluation des offres",
          icon: "»",
        },
      ],
    },
    {
      title: "DOCUMENTATION",
      items: [{ path: "/Blog", name: "Blog budgétaire", icon: "»" }],
    },
    {
      title: "ADMINISTRATION",
      items: [{ path: "/pending-users", name: "Utilisateurs", icon: "»" }],
    },
    {
      title: "PUBLICATIONS",
      items: [
        { path: "/Appel_d_offre", name: "Annonce", icon: "»" },
        { path: "/avis", name: "Avis", icon: "»" },
      ],
    },
    {
      title: "RAPPORTS",
      items: [
        {
          path: "/rapport-de-presentation",
          name: "Rapport de présentation",
          icon: "»",
        },
      ],
    },
    {
      title: "GESTION JURIDIQUE",
      items: [{ path: "/recours", name: "Recours", icon: "»" }],
    },
  ];

  return (
    <>
      <div
        className={`overlay ${isOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      ></div>
      <div className="container">
        <div className="hamburger" onClick={toggleSidebar}>
          <FaBars color={HumbiconColor} size="28px" />
        </div>
        <div
          className={`overlay ${isOpen ? "active" : ""}`}
          onClick={toggleSidebar}
        ></div>
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <div className="top_section">
            <img
              className="logo"
              id="logo"
              src={logo || "/placeholder.svg"}
              alt="Logo"
            />
          </div>

          {menuCategories.map((category, catIndex) => (
            <div key={catIndex}>
              <div className="category-header">{category.title}</div>
              {category.items.map((item, index) => (
                <NavLink
                  onClick={toggleSidebar}
                  to={item.path}
                  key={index}
                  className={({ isActive }) =>
                    `link ${isActive ? "active" : ""}`
                  }
                >
                  <div className="icon" style={{ color: "#FB8808" }}>
                    {item.icon}
                  </div>
                  <div className="link_text">{item.name}</div>
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Sidebar;
