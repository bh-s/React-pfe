import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import logo from '../images/Frame 8 (3).jpg';
import { HamburgetMenuOpen } from "./Icons";
import { FaPhoneAlt } from 'react-icons/fa';

function NavBar() {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const history = useNavigate();
    const [name, setName] = useState('');
    const email = localStorage.getItem('email');

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setName(storedName);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        history("/");
        window.location.reload();
    };

    return (
        <>
            <div className='top-nav'>
                <h4 style={{ cursor: 'pointer' }}><FaPhoneAlt /> +213 (0)27727061</h4>
                <h4 style={{ cursor: 'pointer' }}><FaPhoneAlt /> +213 (0)44 35 49 78</h4>
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
                                to="/home"
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
                                to="/Annonces"
                                activeClassName="active"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                Appel d'offre
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                exact
                                to="/home"
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
                                to="/home"
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
                                to="/home"
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
                        <div className='avatarAuth'>
                            <Menu>
                                <div style={{ height: "40px", borderRadius: "10px", color: '#364F6B', cursor: "pointer", backgroundColor: '#eeeeee', border: 'none', fontSize: '17px', padding: '6px', display: 'flex', fontWeight: '400' }}>
                                    {name}
                                    <MenuButton
                                        as={Avatar}
                                        style={{ height: "35px", borderRadius: "90px", cursor: "pointer", backgroundColor: '#11047A', marginLeft: '5px' }}
                                        src='https://bit.ly/broken-link'
                                    >
                                    </MenuButton>
                                </div>

                                <MenuList style={{ borderRadius: '5px', border: '1px solid #cccccc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)' }}>
                                    <MenuItem style={{
                                        backgroundColor: 'white', border: "none", mt: "5px", paddingBottom: "15px", paddingTop: '10px', fontSize: '16px', padding: '8px'
                                    }}>
                                        {`${email}`
                                        }
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout} style={{ padding: '8px', color: "#F87272", backgroundColor: 'white', zIndex: '10', border: "none", paddingBottom: "10px", cursor: "pointer", fontSize: '16px' }}>
                                        <FaSignOutAlt style={{ marginRight: "5px" }} />
                                        <span>Logout</span>
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
