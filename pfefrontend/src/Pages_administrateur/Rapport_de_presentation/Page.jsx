import React, { useState, useEffect } from 'react';
import { useColorModeValue, Box } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { HiDotsVertical } from 'react-icons/hi';
import Sidebar from '../../components/Sidebar/sidebar';
import { format } from 'date-fns';
import { Menu, MenuButton, MenuList, MenuItem, Avatar } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import '../../components/Navbar/Navbar.css';
import { useParams } from 'react-router-dom';

function Page() {
    const [inputValue, setInputValue] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const bg = useColorModeValue("white");
    const history = useNavigate();
    const email = localStorage.getItem('email');
    const { projectName } = useParams();

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
                <div className="NavBar">
                    <NavLink to="/besoins" className="Titles">
                        Dashboard
                    </NavLink>
                    <div className="avatar" id="logoAvatar" style={{ display: 'flex', position: 'fixed' }}>
                        <div style={{ marginRight: '20px', marginTop: '12px' }}>
                            <select style={{ padding: '5px', fontSize: '15px', borderRadius: '20px' }}>
                                <option>Langue</option>
                                <option>Arabe</option>
                                <option>Français</option>
                            </select>
                        </div>
                        <Menu>
                            <MenuButton
                                as={Avatar}
                                style={{
                                    height: '33px',
                                    borderRadius: '90px',
                                    cursor: 'pointer',
                                    marginRight: '-27px',
                                    marginTop: '10px',
                                    backgroundColor: '#11047A',
                                }}
                                src="https://bit.ly/broken-link"
                            />
                            <MenuList style={{ borderRadius: '5px', border: '1px solid #cccccc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)' }}>
                                <MenuItem style={{ backgroundColor: 'white', padding: '15px', fontSize: '16px' }}>
                                    {email}
                                </MenuItem>
                                <MenuItem
                                    onClick={handleLogout}
                                    style={{ color: '#F87272', backgroundColor: 'white', padding: '10px', fontSize: '16px' }}
                                >
                                    <FaSignOutAlt style={{ marginRight: '5px' }} />
                                    <span>Logout</span>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                </div>

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
                                            <NavLink to={`/rapport/${item.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {index + 1}. {item.name}
                                            </NavLink>                                     </strong>
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

            </main >
        </>
    );
}

export default Page;