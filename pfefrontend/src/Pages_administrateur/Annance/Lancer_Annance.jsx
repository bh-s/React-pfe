import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useColorModeValue, Button, Input, FormControl, FormLabel, Flex, Box, Select } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { AddIcon } from '@chakra-ui/icons';
import Sidebar from '../../components/Sidebar/sidebar';
import './Lancer_Annance.css'
import { HiDotsVertical } from 'react-icons/hi';
import { format } from 'date-fns';

function Appel() {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const bg = useColorModeValue("white");
    const history = useNavigate();
    const email = localStorage.getItem('email');
    const [formData, setFormData] = useState({
        titre: '',
        type: '',
        date: '',
        fileBase64: '',
        fileBase64_2: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, file });
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, fileBase64: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleSecondFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, file2: file });
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, fileBase64_2: reader.result });
        };
        reader.readAsDataURL(file);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions while one is in progress
        setIsSubmitting(true); // Set submitting state to true
        const { titre, type, date, fileBase64, fileBase64_2 } = formData;
        if (!titre || !type || !date || !fileBase64 || !fileBase64_2) {
            setError("Veuillez remplir tous les champs.");
            setIsSubmitting(false); // Reset submitting state
            return;
        }
        try {
            const userData = {
                ...formData,
                role: "pending",
            };
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/saveAnnonce`, userData);
            const { data } = response;
            console.log(response.data);
            if (data) {
                console.log("Token:", data.token);
                setIsOpen(false);
            } else {
                setError(data.message);
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        history("/");
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/getAnnonce`);
                setItems(response.data);
                console.log(response.data);
                setError("");
            } catch (error) {
                console.error(error);
                setError("Une erreur s'est produite lors de la récupération des annonces.");
            }
        };
        fetchData();

        const intervalId = setInterval(fetchData, 2000);
        return () => clearInterval(intervalId);
    }, []);


    const handleDelete = async (itemIdToDelete) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/deleteAnnonce/${itemIdToDelete}`);
            console.log(response.data);
            const updatedItems = items.filter(item => item._id !== itemIdToDelete);
            setItems(updatedItems);
        } catch (error) {
            console.error(error);
            setError("Une erreur s'est produite lors de la suppression de l'annonce.");
        }
    };
    const handleEdit = (item) => {
        setFormData({
            titre: item.titre,
            type: item.type,
            date: item.date,
            fileBase64: item.fileBase64,
            fileBase64_2: item.fileBase64_2
        });
        setIsOpen(true);
    };

    return (

        <> <Sidebar />
            <main>
                <div className='NavBar'>
                    <NavLink to="/besoins" className="Titles">
                        Dashboard
                    </NavLink>
                    <div className='avatar' id='logoAvatar' style={{ display: 'flex', position: 'fixed' }}>
                        <div style={{ marginRight: '20px', marginTop: '12px' }}>
                            <select style={{ padding: '5px', fontSize: '15px', borderRadius: '20px' }}>
                                <option>Langue</option>
                                <option>Arabe</option>
                                <option>Français</option>
                            </select>
                        </div>
                        <Menu>
                            <MenuButton as={Avatar}
                                style={{ height: "33px", borderRadius: "90px", cursor: "pointer", marginRight: "-27px", marginTop: '10px', backgroundColor: '#11047A' }}
                                src='https://bit.ly/broken-link'
                            />
                            <MenuList style={{ borderRadius: '5px', border: '1px solid #cccccc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)' }}>
                                <MenuItem style={{ backgroundColor: 'white', border: "none", mt: "5px", padding: "15px", paddingTop: '10px', fontSize: '16px' }}>
                                    {email}
                                </MenuItem>

                                <MenuItem onClick={handleLogout} style={{ color: "#F87272", backgroundColor: 'white', border: "none", padding: "10px", cursor: "pointer", fontSize: '16px' }}>
                                    <FaSignOutAlt style={{ marginRight: "5px" }} />
                                    <span>Logout</span>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                </div >
                <Flex justifyContent="flex-end">
                    <Button border='1px solid #cccccc' borderRadius={10} leftIcon={<AddIcon />} ml='4px' fontSize={{ sm: '14px', md: '17px' }} fontWeight={700} onClick={() => setIsOpen(true)} backgroundColor="#2B6CB0" color='white' p={10} >CREER</Button>
                </Flex>
                <Box mx="auto" mt={25} ml={20} bg={bg} overflowX="auto" border='1px solid #cccccc' padding='15px' borderRadius={10}>
                    <table style={{ border: 'none' }}>
                        <thead>
                            <tr>
                                <th style={{ border: 'none', color: '#aaaaaa' }}>Projet</th>
                                <th style={{ border: 'none', color: '#aaaaaa' }}>Type</th>
                                <th style={{ border: 'none', color: '#aaaaaa' }}>Cahier de charge</th>
                                <th style={{ border: 'none', color: '#aaaaaa' }}>Annance</th>
                                <th style={{ border: 'none', color: '#aaaaaa' }}>Date de création</th>
                            </tr>
                        </thead>
                        <tbody >
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <td style={{ border: 'none' }}>
                                        <strong style={{ color: '#364F6B', fontWeight: '600', fontSize: '16px' }}>
                                            {item.titre}
                                        </strong>
                                    </td>
                                    <td style={{ border: 'none' }}>
                                        <strong style={{ padding: '5px', borderRadius: '5px', fontWeight: 'bold', color: 'white', fontSize: '14px', backgroundColor: item.type === 'Consultation' ? 'rgb(64, 118, 166)' : 'rgb(65, 194, 129)' }}>
                                            {item.type}
                                        </strong>
                                    </td>
                                    <td style={{ border: 'none' }}>
                                        <strong style={{ color: '#364F6B', fontWeight: '600', fontSize: '16px' }}>
                                            <a href={item.fileURL} target="_blank" rel="noopener noreferrer">Cahider de charge pdf</a>
                                        </strong>
                                    </td>
                                    <td style={{ border: 'none' }}>
                                        <strong style={{ color: '#364F6B', fontWeight: '600', fontSize: '16px' }}>
                                            <a href={item.fileURL2} target="_blank" rel="noopener noreferrer">Annonce pdf</a>
                                        </strong>
                                    </td>
                                    <td style={{ border: 'none' }}>
                                        <Box style={{ color: '#aaaaaa', fontWeight: '600', fontSize: '15px' }}>{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}</Box>
                                    </td>
                                    <td style={{ border: 'none' }}>
                                        <Menu>
                                            <MenuButton as={Box} cursor='pointer'>
                                                <HiDotsVertical color="gray" size="20px" />
                                            </MenuButton>
                                            <MenuList style={{ borderRadius: '5px', border: '1px solid #cccccc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)' }}>
                                                <MenuItem
                                                    style={{ backgroundColor: 'white', border: 'none', padding: '10px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}>
                                                    Modifier
                                                </MenuItem>
                                                <MenuItem style={{ backgroundColor: 'white', border: 'none', padding: '10px', fontSize: '16px', fontWeight: '500', color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(item._id)}>Supprimer</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
                {isOpen && (
                    <Box className="modal">
                        <Box position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" bg={bg} p={6} borderRadius={13} height='auto' width={400} padding={15} >
                            <span className="close" onClick={() => setIsOpen(false)} style={{ float: "right", cursor: "pointer", fontSize: "22px", fontWeight: '600', color: 'red' }}>&times;</span>
                            <form onSubmit={handleSubmit}>
                                <FormLabel fontSize={23} fontWeight={500} marginTop={14} marginBottom={10}>Lancer un Appel d'offre</FormLabel>
                                <label className='margininput'>Titre de l'annonce</label>
                                <input className="input2" id='input2' type="text" name="titre" placeholder="titre" onChange={handleChange} />
                                <label className='margininput'>Dernier délaai</label>
                                <input className="input3" type="date" name="date" placeholder="" onChange={handleChange} />
                                <label className='margininput'>Type</label>
                                <select className='input3' name="type" onChange={handleChange}>
                                    <option value="">Sélectionnez un type</option>
                                    <option value="Consultation">Consultation</option>
                                    <option value="Bon de commande">Bon de Commande</option>
                                </select>
                                <label className='margininput'>Cahier de charge</label>
                                <input type="file" id="file" name="file" className="file-input-button" onChange={handleFileChange} />
                                <div className="file-input-container">
                                    <label htmlFor="file2" className="file-label">L'annonce</label>
                                    <input type="file" id="file2" name="file2" className="file-input-button" onChange={handleSecondFileChange} />
                                </div>
                                <button type="submit" className="btn" style={{ backgroundColor: '#2B6CB0' }} disabled={isSubmitting}>Submit</button> {/* Disable the button if submitting */}
                            </form>
                            {error && <div className="error-message">{error}</div>}
                        </Box>
                    </Box>
                )}
            </main>  </>
    );
}

export default Appel;
