import React, { useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import logo from '../images/Frame 8 (3).jpg';
import './Navbar.css';
import Accueil from '../../Pages_accueil/Accueil/Accueil';
import Presentation from '../../Pages_accueil/Services/Presentation';
import Service from '../../Pages_accueil/Services/Servce';
import Footer from '../Footer/Footer';
import "./Navbar.css";
import { HamburgetMenuClose, HamburgetMenuOpen } from "./Icons";

function NavBar() {
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);

    return (
        <>
            <div className='top-nav'>
                {/* <h4 style={{ cursor: 'pointer' }}><FaPhoneAlt /> +213 (0)27727061</h4>
                <h4 style={{ cursor: 'pointer' }}><FaPhoneAlt /> +213 (0)44 35 49 78</h4> */}
                <select className="selectLang" style={{ padding: '3px', fontSize: '15px', borderRadius: '20px', marginRight: '45px' }}>
                    <option>Langue</option>
                    <option>Arabe</option>
                    <option>Français</option>
                </select>
            </div>
            <nav className="navbar">
                <div className="nav-container">
                    <NavLink exact to="/" className="nav-logo">
                        <img src={logo} alt='uhbc' className="logo" />
                    </NavLink>
                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className="nav-item">
                            <NavLink
                                exact
                                to="/"
                                activeClassName="active"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                Acceuil
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                exact
                                to="/"
                                activeClassName="active"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                Présentation
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                exact
                                to="/"
                                activeClassName="active"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                Services
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                exact
                                to="/"
                                activeClassName="active"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                Contact Us
                            </NavLink>
                        </li>
                    </ul>
                    <div className="nav-icons">
                        <div className="nav-icon" onClick={handleClick}>
                            {click ? (
                                <span className="icon">
                                    < HamburgetMenuOpen />
                                </span>
                            ) : (
                                <span className="icon">
                                    <HamburgetMenuOpen />
                                </span>
                            )}
                        </div>
                        <div className="login-register-buttons">
                            <div className="button-container">
                                <NavLink to="/login"> <button type='submit'style={{ backgroundColor: "#17a27f" }}>Connexion </button></NavLink>
                                <NavLink to="/signup"> <button type='submit' style={{ backgroundColor: "#17a27f" }}>Inscription</button></NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <Accueil /><Presentation /><Service /><Footer />
        </>
    );
}

export default NavBar;
