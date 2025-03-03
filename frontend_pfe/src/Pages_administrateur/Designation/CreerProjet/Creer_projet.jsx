import React, { useState, useEffect } from 'react';
import { useColorModeValue, Button, Input, FormControl, FormLabel, Flex, Box, Select } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { NavLink } from 'react-router-dom';
import { HiDotsVertical } from 'react-icons/hi';
import Sidebar from '../../../components/Sidebar/sidebar';
import { format } from 'date-fns';
import { FaSignOutAlt } from 'react-icons/fa';
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import '../../../components/Navbar/Navbar.css';
import './Creer_projet.css'

function Creer_projet() {
    const [inputValue, setInputValue] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const bg = useColorModeValue("white");
    const history = useNavigate();
    const email = localStorage.getItem('email');

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (itemIdToDelete) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items/${itemIdToDelete}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            console.log('Item deleted successfully');

            fetchItems();

        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleUpdate = async (itemId, updatedData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            fetchItems();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleEdit = (item) => {
        setInputValue(item.name);
        setSelectedType(item.type);
        setSelectedItemId(item._id);
        setIsModalOpen(true);
    };
    const fetchItems = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/getItems`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data.items);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSave = async () => {
        try {
            if (selectedItemId !== null) {
                await handleUpdate(selectedItemId, { name: inputValue, type: selectedType });
                setSelectedItemId(null);
            } else {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/items`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: inputValue,
                        type: selectedType
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to save item');
                }

                const data = await response.json();
                const newItemId = data.data.item;
                localStorage.setItem('lastCreatedItemId', newItemId);

                setInputValue('');
                setSelectedType('');
                setIsModalOpen(false);
                fetchItems();
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        history("/");
    };

    return (
        <>
            <Sidebar />
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
                                style={{ height: "33px", backgroundColor: "#A0AEC0", borderRadius: "90px", cursor: "pointer", marginRight: "-27px", marginTop: '10px', backgroundColor: '#11047A' }}
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
                    <Button border='1px solid #cccccc' borderRadius={10} leftIcon={<AddIcon />} ml='4px' fontSize={{ sm: '14px', md: '17px' }} fontWeight={700} onClick={() => setIsModalOpen(true)} backgroundColor="#2B6CB0" color='white' p={2} >CREER</Button>
                </Flex>
                <Box className='tables' mx="auto" mt={25} ml={20} bg={bg} overflowX="auto" border='1px solid #cccccc' padding='15px' borderRadius={10}>
                    <table style={{ border: 'none' }}>
                        <thead>
                            <tr>
                                <th className="responsive-th" style={{ border: 'none', color: '#aaaaaa' }}>Projet</th>
                                <th className="responsive-th" style={{ border: 'none', color: '#aaaaaa' }}>Type</th>
                                <th className="responsive-th" style={{ border: 'none', color: '#aaaaaa' }}>Date de création</th>
                            </tr>
                        </thead>
                        <tbody >
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <td style={{ border: 'none' }}>
                                        <strong style={{ color: '#364F6B', fontWeight: '600', fontSize: '16px' }}>
                                            <NavLink to={`/data?project=${item.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>{index + 1}. {item.name}</NavLink>
                                        </strong>
                                    </td>
                                    <td style={{ border: 'none' }}>
                                        <strong style={{ padding: '5px', borderRadius: '5px', fontWeight: 'bold', color: 'white', fontSize: '14px', backgroundColor: item.type === 'consultation' ? 'rgb(64, 118, 166)' : 'rgb(65, 194, 129)' }}>
                                            {item.type}
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
                                                    style={{ backgroundColor: 'white', border: 'none', padding: '10px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}
                                                    onClick={() => handleEdit(item)}
                                                >
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
                {isModalOpen && (
                    <Box className='modal'>
                        <Box position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" bg={bg} borderRadius={13} height='auto' width={400} padding={15}>
                            <FormLabel fontSize={23} fontWeight={500} marginTop={14} marginBottom={10}>CREER UN PROJET</FormLabel>
                            <FormControl>
                                <FormLabel fontSize={20} fontWeight={500}>Name</FormLabel>
                                <Input
                                    borderRadius={10}
                                    mt={7}
                                    pl={3}
                                    fontSize={17}
                                    fontWeight={400}
                                    height={10}
                                    width="100%"
                                    border="1px solid #aaaaaa"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Enter name..."
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel fontSize={20} fontWeight={500} marginTop={14}>Type</FormLabel>
                                <Select
                                    borderRadius={10}
                                    mt={5}
                                    fontSize={17}
                                    fontWeight={400}
                                    style={{ width: "100%", height: '45px', borderRadius: '10px', fontSize: '17px', margin: '10px 0 0 3px' }}
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    placeholder="Select type..."
                                >
                                    <option value="consultation">Consultation</option>
                                    <option value="Bon de commande">Bon de commande</option>
                                </Select>
                            </FormControl>
                            <Flex justifyContent="center" mt={4}>
                                <Button backgroundColor="blue" width={100} color={'white'} border='none' borderRadius='20' mr={120} mt={20} padding={3} onClick={handleSave}>Save</Button>
                                <Button width={100} color={'white'} border='none' borderRadius='20' backgroundColor="red" mt={20} onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            </Flex>
                        </Box>
                    </Box>
                )}
            </main >
        </>
    );
}

export default Creer_projet;