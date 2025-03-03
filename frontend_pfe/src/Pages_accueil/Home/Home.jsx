import React, { useState, useEffect } from "react";
import axios from 'axios';
import NavbarAuth from "../../components/Navbar/NavbarAuth";
import './Home.css';
import { Box, Center, Input, Stack, Button, Text, Card, Popover, PopoverTrigger, PopoverContent, PopoverBody, Tooltip } from "@chakra-ui/react";
import Accueil from '../Accueil/Accueil';
import Presentation from '../Services/Presentation';
import Service from '../Services/Servce';
import Footer from '../../components/Footer/Footer';
function Home() {
    const [libelle, setLibelle] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/getLibelle`)
            .then(response => {
                setProducts(response.data);
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleInputChange = (event) => {
        const input = event.target.value.trim();
        setSearchTerm(input);

        if (input === '') {
            setSuggestions([]);
        } else {
            let filteredSuggestions;
            if (!isNaN(input)) {
                filteredSuggestions = products.filter(product =>
                    product.CODE.toString().startsWith(input)
                );
            } else {
                filteredSuggestions = products.filter(product =>
                    product.LIBELLE.toLowerCase().startsWith(input.toLowerCase())
                );
            }

            const sortedSuggestions = filteredSuggestions
                .sort((a, b) => {
                    if (!isNaN(input)) {
                        return parseInt(a.CODE) - parseInt(b.CODE);
                    } else {
                        return a.LIBELLE.localeCompare(b.LIBELLE);
                    }
                })
                .slice(0, 10);
            setSuggestions(sortedSuggestions);
        }
    };
    const handleSuggestionClick = (libelle, code) => {
        const suggestionText = `${libelle} ${code}`;
        setSelectedSuggestion(suggestionText);
        setSearchTerm(suggestionText);
        setLibelle(suggestionText);
        setSuggestions([]);
    };

    const highlightMatch = (libelle) => {
        const index = libelle.toLowerCase().indexOf(searchTerm.toLowerCase());
        if (index === -1) return libelle;

        return (
            <>
                {libelle.substring(0, index)}
                <span style={{ fontWeight: 'bold' }}>
                    {libelle.substring(index, index + searchTerm.length)}
                </span>
                {libelle.substring(index + searchTerm.length)}
            </>
        );
    };

    return (
        <>
            <NavbarAuth />
            {/* <Center>
                <Card className="card" width="800px" height={500} p={8} mt={20} bg="white" boxShadow="xl" borderRadius="lg">
                    <Stack spacing={4}>
                        <Text fontSize="2xl" fontWeight="bold" textAlign="center" fontFamily='poppins'>Rechercher un libellé</Text>
                        <Input
                            className="input"
                            placeholder="Entrez le code"
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                        <ul className="suggestions">
                            {suggestions.length > 0 ? (
                                suggestions.map(product => (
                                    <li key={product._id} onClick={() => handleSuggestionClick(product.LIBELLE, product.CODE)} style={{ cursor: 'pointer' }}>
                                        <Popover trigger="hover"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={suggestions}>
                                            <PopoverTrigger>
                                                <Tooltip placement="right" className="Tooltip" label={`${product.LIBELLE} ${product.CODE}`}>
                                                    <span>
                                                        {highlightMatch(product.LIBELLE.length > 30 ? `${product.LIBELLE.substring(0, 30)}...` : product.LIBELLE)} {highlightMatch(product.CODE.toString())}
                                                    </span>
                                                </Tooltip>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <PopoverBody>
                                                    {`${product.LIBELLE} ${product.CODE}`}
                                                </PopoverBody>
                                            </PopoverContent>
                                        </Popover>
                                    </li>
                                ))
                            ) : searchTerm && (
                                <li className="no-results"></li>
                            )}
                        </ul>
                    </Stack>
                </Card>
            </Center> */}
            <Accueil />
            <Presentation />
            <Service />
            <Footer />
        </>
    );
}

export default Home;
