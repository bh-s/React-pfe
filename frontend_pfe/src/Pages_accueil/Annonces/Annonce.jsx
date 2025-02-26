import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Box, Text, useColorModeValue, Button } from '@chakra-ui/react';
import NavbarAuth from '../../components/Navbar/NavbarAuth';
import axios from 'axios';
import { FaFileDownload } from 'react-icons/fa';
import './Annonce.css';
import icon from './../../Assets/icon.png';

function Annonce() {
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);
    const [filterType, setFilterType] = useState('');
    const [filterDate, setFilterDate] = useState(null);
    const bg = useColorModeValue("white");
    const boxShadowColor = useColorModeValue('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://backend-i154.onrender.com/getAnnonce`);
                setItems(response.data);
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

    const filteredItems = items.filter(item => {
        if (filterType && item.type !== filterType) return false;
        if (filterDate && new Date(item.createdAt) < filterDate) return false;
        return true;
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'type') {
            setFilterType(value);
        } else if (name === 'date') {
            const selectedDate = value ? new Date(value) : null;
            setFilterDate(selectedDate);
        }
    };

    const clearFilters = () => {
        setFilterType('');
        setFilterDate(null);
    };

    return (
        <>
            <NavbarAuth />
            <main className='mainAnnonce'>
                <Box flex="1" mr="4">
                    <Box className='BoxAnnonce' bg={bg} borderWidth="1px" borderRadius="lg" p="22" my="20" mt={45} ml={20} width="auto" style={{ display: 'block', border: '1px solid #bbbbbb', borderRadius: '20px', justifyContent: 'start', boxShadow: `0px 4px 6px ${boxShadowColor}` }}>
                        <Text fontSize="xl" style={{ color: '#364F6B', fontWeight: '600', fontSize: '20px', marginBottom: '10px' }} >Filtres</Text>
                        <select style={{ color: '#364F6B', fontWeight: '300', fontSize: '15px', padding: '3px', width: '100%' }} className='input3' name="type" value={filterType} onChange={handleFilterChange}>
                            <option style={{ color: '#364F6B', fontWeight: '300', fontSize: '15px', padding: '3px' }} value="">Sélectionnez un type</option>
                            <option style={{ color: '#364F6B', fontWeight: '300', fontSize: '15px', padding: '3px' }} value="Consultation">Consultation</option>
                            <option style={{ color: '#364F6B', fontWeight: '300', fontSize: '15px', padding: '3px' }} value="Bon de commande">Bon de Commande</option>
                        </select>
                        <Text fontSize="xl" style={{ color: '#364F6B', fontWeight: '600', fontSize: '20px', marginBottom: '10px' }} >Date de publication</Text>
                        <input style={{ color: '#364F6B', fontWeight: '300', fontSize: '15px', padding: '3px', width: "100%" }} className="input3" type="date" name="date" onChange={handleFilterChange} />
                        <Button className='btn' style={{ backgroundColor: "#dddddd", border: 'none', textAlign: 'center', fontSize: '20px', color: '#364F6B', fontWeight: '600', marginTop: '10px' }} colorScheme="blue" size="sm" onClick={clearFilters} mt={4}>Effacer</Button>
                    </Box>
                </Box>
                <Box flex="3">
                    <Box className='BoxAnnonce' mx="auto" mt={25} ml={110} mr={30} overflowX="auto">
                        {error && <Text color="red">{error}</Text>}
                        {filteredItems.length === 0 ? (
                            <Text>Aucune annonce ne correspond aux filtres sélectionnés.</Text>
                        ) : (
                            filteredItems.map(item => (
                                <Box key={item._id} bg={bg} borderWidth="1px" borderRadius="lg" p="22" my="20" width="auto" style={{ display: 'flex', border: '1px solid #bbbbbb', borderRadius: '20px', justifyContent: 'start', boxShadow: `0px 4px 6px ${boxShadowColor}` }}>
                                    <div>
                                        <img className='annonce' src={icon} alt='' />
                                    </div>
                                    <div>
                                        <Text mb={10} style={{ color: '#364F6B', fontWeight: '600', fontSize: '30px' }} id="title_res"> {item.titre}</Text>
                                        <Text mb={10} mt="2" style={{ padding: '3px', borderRadius: '5px', fontWeight: 'bold', color: 'white', fontSize: '15px', width: '150px', backgroundColor: item.type === 'Consultation' ? 'rgb(64, 118, 166)' : 'rgb(65, 194, 129)' }}>{item.type}</Text>
                                        <Text mb={10} mt="2" style={{ color: '#364F6B', fontWeight: '600', fontSize: '17px' }}>L'Annonce: <a href={item.fileURL2} style={{ backgroundColor: 'rgba(255, 238, 0, 0.345)', padding: '3px' }}> Télécharger <FaFileDownload /> </a></Text>
                                        <Text mb={10} mt="2" style={{ color: '#364F6B', fontWeight: '600', fontSize: '17px' }}>Cahier de charges: <a href={item.fileURL} style={{ backgroundColor: 'rgba(255, 238, 0, 0.345)', padding: '3px' }}>Télécharger <FaFileDownload /></a></Text>
                                        <Box mb={10} mt="2" color="#aaaaaa" fontWeight="600" fontSize="15px" style={{ color: 'rgb(146, 146, 146)' }}><b style={{ color: '#364F6B' }}>Du:</b> {format(new Date(item.createdAt), 'dd/MM/yyyy')}<b style={{ color: '#364F6B' }}> Au:</b> {format(new Date(item.date), 'dd/MM/yyyy')}</Box>
                                    </div>
                                </Box>
                            ))
                        )}
                    </Box>
                </Box>
            </main >
        </>
    );
}

export default Annonce;
