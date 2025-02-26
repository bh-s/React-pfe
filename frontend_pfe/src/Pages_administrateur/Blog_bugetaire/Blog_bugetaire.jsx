import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Menu, MenuButton, MenuList, MenuItem, Box, Flex } from "@chakra-ui/react";
import { FaSignOutAlt } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { useColorModeValue } from '@chakra-ui/react';
import Sidebar from '../../components/Sidebar/sidebar';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import amiri from './Amiri-Regular.ttf'
import { format } from 'date-fns';
import './Blog_bugetaire.css'

function Blog() {
    Font.register({ family: 'Amiri', fonts: [{ src: amiri, fontWeight: 'bold' }] })
    const currentDate = format(new Date(), 'dd/MM/yyyy');

    const updateBlogItem = async (index) => {
        try {
            await axios.put(`http://localhost:5000/updateBlog/${blogItems[index]._id}`, blogItems[index]);
            fetchBlogItems();
        } catch (error) {
            console.error('Error updating blog item:', error);
        }
    };

    const deleteBlogItem = async (id) => {
        try {
            console.log('Attempting to delete blog item with id:', id);
            await axios.delete(`http://localhost:5000/deleteBlog/${id}`);
            console.log('Blog item deleted successfully');
            const updatedBlogItems = blogItems.filter(item => item._id !== id);
            setBlogItems(updatedBlogItems);
        } catch (error) {
            console.error('Error deleting blog item:', error);
        }
    };
    const handleKeyUp = (e, index) => {
        if (e.key === 'Enter') {
            updateBlogItem(index);
        } else if (e.key === 'Escape') {
            fetchBlogItems();
        }
    };

    const email = localStorage.getItem('email');
    const history = useNavigate();
    const bg = useColorModeValue("white");
    const [blogItems, setBlogItems] = useState([]);
    const [formData, setFormData] = useState({
        credit_payment: '',
        licences_engagement: '',
        declaration: '',
        article: '',
        porte: '',
        titre: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCompleteSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/saveBlog', formData);
            setFormData({
                credit_payment: '',
                licences_engagement: '',
                declaration: '',
                article: '',
                porte: '',
                titre: ''
            });
            fetchBlogItems();
        } catch (error) {
            console.error('Error saving blog:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        history("/");
    };
    function getArabicNumber(number) {
        const arabicNumbers = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر"];
        return arabicNumbers[number - 1] || number.toString();
    }

    const fetchBlogItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getBlog');
            setBlogItems(response.data.setBlog);
        } catch (error) {
            console.error('Error fetching blog items:', error);
        }
    };

    useEffect(() => {
        fetchBlogItems();
    }, []);

    const calculateTotals = (items) => {
        const totals = {};
        items.forEach(item => {
            if (!totals[item.porte]) {
                totals[item.porte] = {
                    credit_payment: 0,
                    licences_engagement: 0,
                };
            }
            totals[item.porte].credit_payment += parseFloat(item.credit_payment || 0);
            totals[item.porte].licences_engagement += parseFloat(item.licences_engagement || 0);
        });
        return totals;
    };
    const calculateTotalsByTitle = (items) => {
        const totalsByTitle = {};
        items.forEach(item => {
            const titre = item.titre;
            if (!totalsByTitle[titre]) {
                totalsByTitle[titre] = {
                    credit_payment: 0,
                    licences_engagement: 0,
                };
            }
            totalsByTitle[titre].credit_payment += parseFloat(item.credit_payment || 0);
            totalsByTitle[titre].licences_engagement += parseFloat(item.licences_engagement || 0);
        });
        return totalsByTitle;
    };
    const autoSave = async (blogItemId, updatedFields) => {
        const itemToUpdate = blogItems.find(item => item._id === blogItemId);
        try {
            if (itemToUpdate) {
                const updatedItem = { ...itemToUpdate, ...updatedFields };
                await axios.put(`http://localhost:5000/updateBlog/${blogItemId}`, updatedItem);
                console.log("Autosaved successfully.");
            } else {
                console.error("Blog item not found.");
            }
        } catch (error) {
            console.error("Failed to update blog item:", error);
        }
    };

    const totalsByTitle = calculateTotalsByTitle(blogItems);
    const titles = Object.keys(totalsByTitle);

    const totals = calculateTotals(blogItems);

    const handleInputEdit = (index, field, value) => {
        const updatedItems = [...blogItems];
        updatedItems[index][field] = value;
        setBlogItems(updatedItems);
    };

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#ffffff',
            padding: 10,

        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
            fontSize: 12
        },
        header: {
            textAlign: 'center',
            fontSize: '18',
            padding: '5'
        },
        tableRow: {
            flexDirection: 'row',
            width: '100%',
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: '#202124',
        },
        tableCell: {
            fontSize: 12,
            textAlign: 'center',
            padding: 5,
            borderRightWidth: 1,
            borderColor: '#202124',
            flex: 1,
        }
    })

    const PDFDocument = ({ blogItems }) => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={[styles.title, { textAlign: 'left', marginBottom: '5px', fontSize: '12px', color: 'black' }]}>Date: {currentDate}</Text>
                    <Text style={[styles.title, { fontWeight: '500', fontFamily: 'Amiri', marginBottom: '10px', fontSize: '12px', paddingLeft: '100px', paddingRight: '100px', color: 'black', textAlign: 'center' }]}>الجمهورية الجزائرية الديموقراطية الشعبية<br /> وزارة التعليم العالي و البحث العلمي <br /> جامعة حسيبة بن بوعلي الشلف<br />كلية العلوم الدقيقة و الاعلام الالي</Text>
                    <Text style={[styles.header, { fontFamily: 'Amiri' }]}>مدونة ميزانية الجامعة</Text>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>اعتمادات الدفع (دج)</Text>
                        <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>رخص الالتزام (دج)</Text>
                        <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>البيان</Text>
                        <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>رقم المادة</Text>
                        <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>رقم الباب</Text>
                    </View>
                    {blogItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>{item.credit_payment}</Text>
                                <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>{item.licences_engagement}</Text>
                                <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>{item.declaration}</Text>
                                <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>{item.article}</Text>
                                <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>{item.porte}</Text>
                            </View>
                            {index === blogItems.length - 1 || blogItems[index + 1].porte !== item.porte ? (
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>{totals[item.porte].credit_payment}</Text>
                                    <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>{totals[item.porte].licences_engagement}</Text>
                                    <Text style={[styles.tableCell, { textAlign: 'right', fontWeight: 'bold', fontFamily: 'Amiri' }]} colSpan={3}>
                                        مجموع الباب {' '}{item.porte}
                                    </Text>
                                </View>
                            ) : null}
                        </React.Fragment>
                    ))}
                    <Text style={[styles.header, { textAlign: 'right', marginTop: '10px', marginBottom: '5px', fontSize: 18, fontFamily: 'Amiri' }]}>مجموع الابواب</Text>
                    {titles.length > 0 && titles.filter(titre => titre.trim() !== '').map((titre, index) => (
                        <View key={`total-${index}`} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>{totalsByTitle[titre].credit_payment}</Text>
                            <Text style={[styles.tableCell, { fontFamily: 'Amiri' }]}>{totalsByTitle[titre].licences_engagement}</Text>
                            <Text style={[styles.tableCell, { textAlign: 'right', fontWeight: 'bold', fontFamily: 'Amiri' }]} colSpan={3}>
                                مجموع الباب {getArabicNumber(index + 1)} - {titre}
                            </Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );


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
                </div>
                <Flex display='flex' justifyContent='space-between' alignItems="center">

                    <h3 id='subtitle' style={{ color: '#364F6B', cursor: 'pointer', width: '250px', marginLeft: '25px' }}>
                        Dashboard<ArrowRightIcon style={{ fontSize: '10px', marginLeft: '3px', marginRight: '3px' }} />
                        <span>مدونة ميزانية الجامعة</span>
                    </h3>
                    <button className='pdfButton btn2' style={{ marginBottom: '10px' }}>
                        <PDFDownloadLink document={<PDFDocument blogItems={blogItems} />} fileName="blog_tableau.pdf">
                            {({ blob, url, loading, error }) => (loading ? 'chargement...' : <span style={{ color: 'white' }}>Télécharger</span>)}
                        </PDFDownloadLink>
                    </button>
                </Flex>
                <Box className='tables' mx="auto" mt={5} ml={20} bg={bg} overflowX="auto" border='2px solid #cccccc' padding='25px' borderRadius={10}>
                    {/* <form onSubmit={handleCompleteSubmit}>
                        <input type="text" name="credit_payment" value={formData.credit_payment} onChange={handleInputChange} placeholder="Crédit de paiement" />
                        <input type="text" name="licences_engagement" value={formData.licences_engagement} onChange={handleInputChange} placeholder="Licences d'engagement" />
                        <input type="text" name="declaration" value={formData.declaration} onChange={handleInputChange} placeholder="Déclaration" />
                        <input type="text" name="article" value={formData.article} onChange={handleInputChange} placeholder="Article" />
                        <input type="text" name="porte" value={formData.porte} onChange={handleInputChange} placeholder="Porte" />
                        <input type="text" name="titre" value={formData.titre} onChange={handleInputChange} placeholder="Titre" />
                        <button type="submit">Enregistrer</button>
                    </form> */}
                    <table>
                        <thead>
                            <tr>
                                <th id='index' >اعتمادات الدفع (دج)</th>
                                <th id='index'  >رخص الالتزام (دج)</th>
                                <th id='index' >البيان</th>
                                <th id='index' >رقم المادة</th>
                                <th id='index' >رقم الباب</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogItems.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr id='index'
                                        style={{ textAlign: 'right', fontWeight: 'bold' }}>{item.titre}</tr>
                                    <tr>
                                        <td>
                                            <input
                                                id='index'

                                                type="text"
                                                value={item.credit_payment}
                                                onChange={(e) => {
                                                    handleInputEdit(index, 'credit_payment', e.target.value);
                                                    autoSave(item._id, { credit_payment: e.target.value });
                                                }}
                                                onKeyDown={(e) => handleKeyUp(e, index)}
                                                style={{ textAlign: 'right', width: '100px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                id='index'

                                                type="text"
                                                value={item.licences_engagement}
                                                onChange={(e) => {
                                                    handleInputEdit(index, 'licences_engagement', e.target.value);
                                                    autoSave(item._id, { licences_engagement: e.target.value });
                                                }}
                                                onKeyDown={(e) => handleKeyUp(e, index)}
                                                style={{ textAlign: 'right', width: '100px' }}
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                type="text"
                                                value={item.declaration}
                                                onChange={(e) => {
                                                    handleInputEdit(index, 'declaration', e.target.value);
                                                    autoSave(item._id, { declaration: e.target.value });
                                                }}
                                                onKeyDown={(e) => handleKeyUp(e, index)}
                                                style={{ overflowY: 'hidden', width: '290px', height: 'auto', textAlign: 'right' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                id='index'

                                                type="text"
                                                value={item.article}
                                                onChange={(e) => {
                                                    handleInputEdit(index, 'article', e.target.value);
                                                    autoSave(item._id, { article: e.target.value });
                                                }}
                                                onKeyDown={(e) => handleKeyUp(e, index)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                id='index'
                                                type="text"
                                                value={item.porte}
                                                onChange={(e) => {
                                                    handleInputEdit(index, 'porte', e.target.value);
                                                    autoSave(item._id, { porte: e.target.value });
                                                }}
                                                onKeyDown={(e) => handleKeyUp(e, index)}
                                            />
                                        </td>
                                        {/* 
                                        <td>
                                            <button onClick={() => deleteBlogItem(item._id)}>Supprimer</button>
                                        </td> */}
                                    </tr>
                                    {index === blogItems.length - 1 || blogItems[index + 1].porte !== item.porte ? (
                                        <tr key={`total-${index}`}>
                                            <td style={{ backgroundColor: '#dddddd' }}>{totals[item.porte].credit_payment}</td>
                                            <td style={{ backgroundColor: '#dddddd' }}>{totals[item.porte].licences_engagement}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold', backgroundColor: '#dddddd' }} colSpan="3"> مجموع الباب {' '}{item.porte}</td>
                                        </tr>
                                    ) : null}
                                </React.Fragment>
                            ))}
                            <h3 style={{ textAlign: 'right' }}>مجموع الابواب</h3>
                            {
                                titles.length > 0 && (
                                    titles.filter(titre => titre.trim() !== '').map((titre, index) => (
                                        <tr key={`total-${index}`} style={{ borderTop: "2px solid black" }}>
                                            <td>{totalsByTitle[titre].credit_payment}</td>
                                            <td>{totalsByTitle[titre].licences_engagement}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold' }} colSpan="3">مجموع الباب {getArabicNumber(index + 1)} - {titre}</td>
                                        </tr>
                                    ))
                                )
                            }
                        </tbody>
                    </table>
                </Box>
            </main >
        </>
    )
}

export default Blog;

