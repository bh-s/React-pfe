import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useColorModeValue, Flex, Button } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons'
import { FaHome, FaBars, FaUserFriends, FaUserShield, FaMoneyBillWave, FaUserCircle } from "react-icons/fa";
import { Icon, useColorMode, Text } from "@chakra-ui/react";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import logo from '../images/Frame 8 (3).jpg'
import './sidebar.css'
const Sidebar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(!isOpen);
    const sidebarBackgroundColor = useColorModeValue("white", "#1B254B");
    const textColor = useColorModeValue("black", "white");
    const iconColor = useColorModeValue("#4318FF", "white");
    const HumbiconColor = useColorModeValue("#A0AEC0", "white");

    const menuItem = [
        { path: "/besoins", name: 'Désignation', icon: <ArrowRightIcon color='#FB8808' /> },
        { path: "/ouverture_et_evaluation_des_offres", name: '  Procès-verbal d’ouverture et évaluation des offres', icon: <ArrowRightIcon color='#FB8808' /> },
        { path: "/rapport-projects", name: 'Rapport de présentation', icon: <ArrowRightIcon color='#FB8808' /> },
        { path: "/Blog", name: 'Blog budgétaire', icon: <ArrowRightIcon color='#FB8808' /> },
        { path: "/pending-users", name: 'Utilisateurs', icon: <ArrowRightIcon color='#FB8808' /> },
        { path: "/Appel_d_offre", name: 'Annance', icon: <ArrowRightIcon color='#FB8808' /> },
        { path: "*", name: "Avis", icon: <ArrowRightIcon color='#FB8808' /> },
        { path: "*", name: 'Recours', icon: <ArrowRightIcon color='#FB8808' /> },
    ];

    return (
        <>
            <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
            <div className="container">
                <div className="hamburger" onClick={toggleSidebar}>
                    <FaBars color={HumbiconColor} size="28px" />
                </div>
                <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
                <div className={`sidebar ${isOpen ? 'open' : ''}`} style={{ backgroundColor: sidebarBackgroundColor }}>
                    <div className="top_section" style={{ borderBottom: '2px solid #8F8F8F' }} >
                        <img className="logo" id='logo' src={logo} alt=';' />
                    </div>

                    {menuItem.map((item, index) => (
                        <NavLink
                            onClick={toggleSidebar}
                            to={item.path}
                            key={index}
                            className="link"
                            style={location.pathname === item.path ?
                                { color: '#000' } :
                                { color: textColor, fontWeight: "500" }}>
                            <div className="icon">{item.icon}</div>
                            <div className="link_text">{item.name}</div>
                        </NavLink>
                    ))}

                </div>
            </div >
            <Outlet />
        </>
    );
};

export default Sidebar;
