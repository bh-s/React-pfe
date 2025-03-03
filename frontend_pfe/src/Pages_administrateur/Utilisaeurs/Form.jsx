import React, { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";

const SignupForm = ({ onSubmit }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "controller",
        phoneNumber: "",
        fileBase64: "",
    });

    const [fileError, setFileError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            ...(name === "role" && value !== "user" ? { fileBase64: "" } : {}),
        }));

        if (name === "role" && value !== "user") {
            setFileError("");
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setFormData({ ...formData, fileBase64: reader.result });
                setFileError("");
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.role === "user" && !formData.fileBase64) {
            setFileError("Un fichier est requis pour les utilisateurs.");
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/createUserFromAdmin`,
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            alert("Utilisateur créé avec succès !");
            onClose();
            if (onSubmit) onSubmit(formData);
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur :", error);
            alert(error.response?.data?.message || "Erreur serveur. Veuillez réessayer.");
        }
    };

    return (
        <>
            <Button colorScheme="blue" onClick={onOpen}>
                Ouvrir le formulaire
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Créer un utilisateur</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box as="form" onSubmit={handleSubmit}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Nom</FormLabel>
                                    <Input name="name" value={formData.name} onChange={handleChange} />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Mot de passe</FormLabel>
                                    <Input type="password" name="password" value={formData.password} onChange={handleChange} />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Numéro de téléphone</FormLabel>
                                    <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Rôle</FormLabel>
                                    <Select name="role" value={formData.role} onChange={handleChange}>
                                        <option value="admin">Admin</option>
                                        <option value="user">Utilisateur</option>
                                        <option value="controller">Contrôleur financier</option>
                                    </Select>
                                </FormControl>

                                <FormControl isInvalid={fileError !== ""}>
                                    <FormLabel>Fichier (PDF/Image) {formData.role === "user" && "*"}</FormLabel>
                                    <Input
                                        type="file"
                                        accept=".pdf,.jpg,.png"
                                        onChange={handleFileChange}
                                        isDisabled={formData.role !== "user"}
                                    />
                                    {fileError && <p style={{ color: "red", fontSize: "0.9em" }}>{fileError}</p>}
                                </FormControl>

                                <Button type="submit" colorScheme="blue" width="full">
                                    Créer un utilisateur
                                </Button>
                            </VStack>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SignupForm;
