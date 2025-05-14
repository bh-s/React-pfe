import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useColorModeValue, Flex, Button } from '@chakra-ui/react';
import { FaHome, FaBars, FaUserFriends, FaUserShield, FaMoneyBillWave, FaUserCircle, FaFileAlt, FaGavel, FaClipboardList, FaBullhorn, FaExclamationCircle, FaUndo } from "react-icons/fa";
import { Icon, useColorMode, Text } from "@chakra-ui/react";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import { motion } from 'framer-motion';
import logo from '../images/Frame 8 (3).jpg'
import './sidebar.css'

const Sidebar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true); // Changed to true for default visible state
    const toggleSidebar = () => setIsOpen(!isOpen);
    const sidebarBackgroundColor = useColorModeValue("white", "#1B254B");
    const textColor = useColorModeValue("black", "white");
    const iconColor = useColorModeValue("#4318FF", "white");
    const HumbiconColor = useColorModeValue("#A0AEC0", "white");
    const activeBgColor = useColorModeValue("rgba(221, 255, 220, 0.7)", "rgba(46, 52, 90, 0.7)");
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSidebarHover = () => {
        setIsOpen(true);
    };

    const menuItem = [
        { path: "/besoins", name: 'Désignation', icon: <FaFileAlt /> },
        { path: "/ouverture_et_evaluation_des_offres", name: 'Procès-verbal d\'ouverture et évaluation des offres', icon: <FaGavel /> },
        { path: "/rapport-projects", name: 'Rapport de présentation', icon: <FaClipboardList /> },
        { path: "/Blog", name: 'Blog budgétaire', icon: <FaMoneyBillWave /> },
        { path: "/pending-users", name: 'Utilisateurs', icon: <FaUserFriends /> },
        { path: "/Appel_d_offre", name: 'Annance', icon: <FaBullhorn /> },
        { path: "*", name: "Avis", icon: <FaExclamationCircle /> },
        { path: "*", name: 'Recours', icon: <FaUndo /> },
    ];

    const itemVariants = {
        open: {
            opacity: 1,
            x: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        },
        closed: { opacity: 0, x: -20 },
    };

    return (
        <>
            <div className="container" onMouseEnter={handleSidebarHover}>
                <motion.div 
                    className="hamburger" 
                    onClick={toggleSidebar}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaBars color={HumbiconColor} size="28px" />
                </motion.div>
                
                <motion.div 
                    ref={sidebarRef}
                    className={`sidebar ${!isOpen ? 'closed' : ''}`} 
                    style={{ backgroundColor: sidebarBackgroundColor }}
                    animate={isOpen ? "open" : "closed"}
                    initial="closed"
                    variants={{
                        open: { 
                            width: 240, 
                            x: 0,
                            transition: { duration: 0.3 }
                        },
                        closed: { 
                            width: 0, 
                            x: -240,
                            transition: { duration: 0.3 }
                        }
                    }}
                >
                    <div className="top_section" style={{ borderBottom: '2px solid #8F8F8F' }} >
                        <motion.img 
                            className="logo" 
                            id='logo' 
                            src={logo} 
                            alt='Logo'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        />
                    </div>

                    {menuItem.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <NavLink
                                onClick={toggleSidebar}
                                to={item.path}
                                className="link"
                                style={({ isActive }) => ({
                                    color: isActive ? '#000' : textColor,
                                    fontWeight: isActive ? "600" : "500",
                                    background: isActive ? activeBgColor : "transparent"
                                })}
                            >
                                <div className="icon" style={{ color: iconColor }}>
                                    {item.icon}
                                </div>
                                <div className="link_text">{item.name}</div>
                            </NavLink>
                        </motion.div>
                    ))}

                </motion.div>
            </div>
            <Outlet />
        </>
    );
};

export default Sidebar;
