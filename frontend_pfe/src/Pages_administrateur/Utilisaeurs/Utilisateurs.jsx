import React, { useState, useEffect } from 'react';
import { useColorModeValue, Box } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/sidebar';
import { FaSignOutAlt } from 'react-icons/fa';
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import emailjs from 'emailjs-com';

import './Style.css';
function PendingUsers() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [acceptedUsers, setAcceptedUsers] = useState([]);
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const bg = useColorModeValue("white");
    const email = localStorage.getItem('email');
    const history = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        history("/");
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const pendingResponse = await axios.get(`http://localhost:5000/pending-users`);
                const acceptedResponse = await axios.get(`http://localhost:5000/users-with-role-user`);
                const deletedResponse = await axios.get(`http://localhost:5000/deleted-users`);
                setPendingUsers(pendingResponse.data);
                setAcceptedUsers(acceptedResponse.data);
                setDeletedUsers(deletedResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        const interval = setInterval(() => {
            fetchData();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleAcceptUser = async (userId, userEmail) => {
        try {
            await axios.put(`http://localhost:5000/user/${userId}/accept`, { role: 'user' });
            const updatedPendingUsers = pendingUsers.filter(user => user._id !== userId);
            setPendingUsers(updatedPendingUsers);
            const acceptedUser = pendingUsers.find(user => user._id === userId);
            if (acceptedUser) {
                setAcceptedUsers(prevAcceptedUsers => [...prevAcceptedUsers, { ...acceptedUser, status: 'Active', accepted: true }]);
                if (userEmail.trim() !== '' && userEmail.includes('@')) {
                    const templateParams = {
                        to_email: userEmail,

                    };
                    await emailjs.send('service_13bqotq', 'template_zilu8cx12', templateParams, 'i5UrKNuU6hUZJHCOm');
                }
            }
        } catch (error) {
            console.error('Error accepting user:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.put(`http://localhost:5000/user/${userId}/delete`, { isDeleted: true });
            const deletedUser = pendingUsers.find(user => user._id === userId);
            if (deletedUser) {
                setDeletedUsers([...deletedUsers, { ...deletedUser, status: 'Deleted' }]);
                setPendingUsers(prevPendingUsers => prevPendingUsers.filter(user => user._id !== userId));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleAcceptDeletedUser = async (userId, userEmail) => {
        try {
            await axios.put(`http://localhost:5000/user/${userId}/rmdelete`, { role: 'user' });
            const restoredUser = deletedUsers.find(user => user._id === userId);
            if (restoredUser) {
                setDeletedUsers(prevDeletedUsers => prevDeletedUsers.filter(user => user._id !== userId));
                setAcceptedUsers(prevAcceptedUsers => [...prevAcceptedUsers, { ...restoredUser, status: 'Active' }]);
                if (userEmail.trim() !== '' && userEmail.includes('@')) {
                    const templateParams = {
                        to_email: userEmail,
                    };
                    await emailjs.send('service_13bqotq', 'template_zilu8cx12', templateParams, 'i5UrKNuU6hUZJHCOm');
                }
            }
        } catch (error) {
            console.error('Error accepting deleted user:', error);
        }
    };


    return (
        <><Sidebar /><main>
            <div className='NavBar'>
                <NavLink to="/besoins" className="Titles" >
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
            </div>

            <div>
                <h3 id='subtitle' style={{ color: '#364F6B', cursor: 'pointer', width: '250px', marginLeft: '25px', marginBottom: '-10px', fontSize: '24px' }}>
                    Liste d'attente</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Box className='tables' mx="auto" mt={25} ml={20} bg={bg} overflowX="auto" border='1px solid #cccccc' padding='25px' borderRadius={10}>

                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Document</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingUsers.map(user => (
                                    !user.isDeleted && (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phoneNumber}</td>
                                            <td><a href={user.fileURL} target="_blank" rel="noopener noreferrer">Document</a></td>
                                            <td>{format(new Date(user.createdAt), 'dd/MM/yyyy, HH:mm')}</td>
                                            <td><span style={{ color: user.isDeleted ? 'red' : 'green' }}>{user.isDeleted ? 'Deleted' : 'Active'}</span></td>
                                            <td>
                                                {!user.accepted && (
                                                    <>
                                                        <div className="button-group">

                                                            <button className="accept" onClick={() => handleAcceptUser(user._id, user.email)}>Accepter</button>
                                                            <button className="delete" onClick={() => handleDeleteUser(user._id)}>Supprimer</button>
                                                        </div>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </table>
                    </Box>
                )}

                <h3 id='subtitle' style={{ color: '#364F6B', cursor: 'pointer', width: '250px', marginLeft: '25px', marginBottom: '-10px', fontSize: '24px', marginTop: '10px' }}>
                    Utilisateurs</h3>
                <Box className='tables' mx="auto" mt={15} ml={20} bg={bg} overflowX="auto" border='1px solid #cccccc' padding='25px' borderRadius={10}>

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Document</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {acceptedUsers.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td><a href={user.fileURL} target="_blank" rel="noopener noreferrer">Document</a></td>
                                    <td>{format(new Date(user.createdAt), 'dd/MM/yyyy, HH:mm')}</td>
                                    <td><span style={{ color: user.isDeleted ? 'red' : 'green' }}>{user.isDeleted ? 'Deleted' : 'Active'}</span></td>
                                    <td>
                                        {!user.accepted && (
                                            <div className="button-group">
                                                <button className="accept" onClick={() => handleAcceptDeletedUser(user._id)}>Restaurer</button>
                                                <button className="delete" onClick={() => handleDeleteUser(user._id)}>Supprimer</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {deletedUsers.map(user => (
                                !acceptedUsers.some(acceptedUser => acceptedUser.email === user.email) && (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phoneNumber}</td>
                                        <td><a href={user.fileURL} target="_blank" rel="noopener noreferrer">Document</a></td>
                                        <td>{format(new Date(user.createdAt), 'dd/MM/yyyy, HH:mm')}</td>
                                        <td><span style={{ color: 'red' }}>Deleted</span></td>
                                        <td>
                                            {!user.accepted && (
                                                <>
                                                    <div className="button-group">
                                                        <button className="accept" onClick={() => handleAcceptDeletedUser(user._id)}>Restaurer</button>
                                                        <button className="delete" onClick={() => handleDeleteUser(user._id)}>Supprimer</button>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                )
                            ))}

                        </tbody>
                    </table>
                </Box>
            </div>
        </main></>
    );
}

export default PendingUsers;
