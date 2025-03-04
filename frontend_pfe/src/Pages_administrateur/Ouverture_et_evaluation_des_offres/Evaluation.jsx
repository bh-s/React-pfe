import React, { useEffect, useState } from 'react';
import { Box, Table, Tbody, Tr, Th, Td, Button, Menu, Avatar, MenuButton, MenuList, MenuItem, Flex, Input, TableContainer } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/sidebar';
import { NavLink } from 'react-router-dom';
import { FaSave, FaSignOutAlt, FaTrashAlt } from 'react-icons/fa';


const Evaluation = () => {
    const { projectName } = useParams();
    const navigate = useNavigate();
    const history = useNavigate();
    const email = localStorage.getItem('email');
    const [rows, setRows] = useState([]);
    const [newRow, setNewRow] = useState(null);
    const handleAction1 = () => {
        navigate(`/ouverture_et_evaluation_des_offres/${projectName}/ouverture`);
    };

    const handleAction2 = () => {
        navigate(`/ouverture_et_evaluation_des_offres/${projectName}/evaluation`);
    };
    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        history("/");
    };
    useEffect(() => {
        const fetchRows = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/${projectName}/ouverture`);
                if (!response.ok) throw new Error('Échec du chargement des données');
                const data = await response.json();
                setRows(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };
        fetchRows();
    }, [projectName])


    const saveRow = async (row) => {
        try {
            const token = localStorage.getItem('token');
            const url = row._id
                ? `${import.meta.env.VITE_API_URL}/${projectName}/ouverture/${row._id}`  // Update endpoint
                : `${import.meta.env.VITE_API_URL}/${projectName}/ouverture`;  // Add endpoint

            const method = row._id ? 'PUT' : 'POST';  // PUT if updating, POST if creating

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(row)
            });

            if (!response.ok) throw new Error('Échec de la sauvegarde');

            const savedRow = await response.json();

            if (row._id) {
                setRows(rows.map(r => r._id === row._id ? savedRow : r));
            } else {

                setRows([...rows, savedRow]);
                setNewRow(null);
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const deleteRow = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/${projectName}/ouverture`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error('Échec de la suppression');
            setRows(rows.filter((row) => row._id !== id));
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleInputChange = (value, field, nestedField = null, rowId) => {
        const updatedRows = rows.map(row => {
            if (row._id === rowId) {
                if (nestedField) {
                    return {
                        ...row,
                        [field]: {
                            ...row[field],
                            [nestedField]: value
                        }
                    };
                }
                return { ...row, [field]: value };
            }
            return row;
        });
        setRows(updatedRows);
    };
    return (
        <><Sidebar />
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
                <Box mt={10} p={5}>
                    <Flex justifyContent="center" alignItems="center" gap={10}>
                        <Button _hover="none" bg p={6} bgColor="teal" fontSize="20px" fontFamily="serif" color="white" borderRadius={30} mr={3} onClick={handleAction1}>
                            Procès-verbal d’ouverture
                        </Button>
                        <Button _hover="none" bg p={6} bgColor="teal" fontSize="20px" fontFamily="serif" color="white" borderRadius={30} mr={3} onClick={handleAction2}>
                            Evaluation des offres
                        </Button>
                    </Flex>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
                        {projectName} : تقييم العروض
                    </h1>
                    <Box mt={10} textAlign="center">
                        <Button colorScheme="gray" onClick={() => navigate(-1)}>Retour</Button>
                    </Box>
                </Box>
            </main></>
    );
};

export default Evaluation;
