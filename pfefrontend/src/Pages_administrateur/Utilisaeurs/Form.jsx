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
    Text,
    Flex,
    Avatar,
    Icon,
    useToast,
} from "@chakra-ui/react";
import { FiUpload, FiUser, FiMail, FiLock, FiPhone, FiFile } from "react-icons/fi";
import axios from "axios";

const SignupForm = ({ onSubmit }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "controller",
        phoneNumber: "",
        fileBase64: "",
    });

    const [fileError, setFileError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            ...(name === "role" && value !== "user" ? { fileBase64: "" } : {}),
        }));

        if (name === "role" && value !== "user") {
            setFileError("");
            setFileName("");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setFileError("File size should be less than 5MB");
                return;
            }
            
            setFileName(file.name);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setFormData({ ...formData, fileBase64: reader.result });
                setFileError("");
            };
            reader.onerror = () => {
                setFileError("Error reading file");
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (formData.role === "user" && !formData.fileBase64) {
            setFileError("Un fichier est requis pour les utilisateurs.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/createUserFromAdmin`,
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            toast({
                title: "Success",
                description: "Utilisateur créé avec succès!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            
            // Reset form
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "controller",
                phoneNumber: "",
                fileBase64: "",
            });
            setFileName("");
            onClose();
            if (onSubmit) onSubmit(formData);
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur :", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Erreur serveur. Veuillez réessayer.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Button 
                onClick={onOpen}
                colorScheme="blue"
                size="lg"
                borderRadius="md"
                boxShadow="md"
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
            >
                Ajouter un utilisateur
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
                <ModalContent borderRadius="xl" overflow="hidden">
                    <ModalHeader 
                        bg="blue.500" 
                        color="white"
                        fontSize="xl"
                        fontWeight="semibold"
                        py={4}
                    >
                        <Flex align="center">
                            <Avatar bg="blue.600" size="sm" mr={3} />
                            Créer un nouvel utilisateur
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton color="white" _hover={{ bg: "blue.600" }} />
                    
                    <ModalBody maxH="70vh" overflowY="auto" py={6} px={8}>
                        <Box as="form" onSubmit={handleSubmit}>
                            <VStack spacing={6}>
                                <FormControl isRequired>
                                    <FormLabel display="flex" alignItems="center">
                                        <Icon as={FiUser} mr={2} /> Nom complet
                                    </FormLabel>
                                    <Input 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        borderRadius="md"
                                        focusBorderColor="blue.500"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel display="flex" alignItems="center">
                                        <Icon as={FiMail} mr={2} /> Email
                                    </FormLabel>
                                    <Input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        borderRadius="md"
                                        focusBorderColor="blue.500"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel display="flex" alignItems="center">
                                        <Icon as={FiLock} mr={2} /> Mot de passe
                                    </FormLabel>
                                    <Input 
                                        type="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        borderRadius="md"
                                        focusBorderColor="blue.500"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel display="flex" alignItems="center">
                                        <Icon as={FiPhone} mr={2} /> Numéro de téléphone
                                    </FormLabel>
                                    <Input 
                                        name="phoneNumber" 
                                        value={formData.phoneNumber} 
                                        onChange={handleChange}
                                        placeholder="+1234567890"
                                        borderRadius="md"
                                        focusBorderColor="blue.500"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Rôle</FormLabel>
                                    <Select 
                                        name="role" 
                                        value={formData.role} 
                                        onChange={handleChange}
                                        borderRadius="md"
                                        focusBorderColor="blue.500"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="user">Utilisateur</option>
                                        <option value="controller">Contrôleur financier</option>
                                    </Select>
                                </FormControl>

                                <FormControl isInvalid={fileError !== ""}>
                                    <FormLabel display="flex" alignItems="center">
                                        <Icon as={FiFile} mr={2} /> 
                                        Fichier (PDF/Image) 
                                        {formData.role === "user" && (
                                            <Text as="span" color="red.500" ml={1}>*</Text>
                                        )}
                                    </FormLabel>
                                    
                                    {fileName ? (
                                        <Text fontSize="sm" color="gray.600" mb={2}>
                                            Fichier sélectionné: {fileName}
                                        </Text>
                                    ) : null}
                                    
                                    <Box
                                        border="2px dashed"
                                        borderColor={fileError ? "red.300" : "gray.300"}
                                        borderRadius="md"
                                        p={4}
                                        textAlign="center"
                                        bg={fileError ? "red.50" : "gray.50"}
                                        _hover={{ borderColor: "blue.300" }}
                                        transition="border-color 0.2s"
                                    >
                                        <Input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            isDisabled={formData.role !== "user"}
                                            position="absolute"
                                            opacity={0}
                                            width="100%"
                                            height="100%"
                                            left={0}
                                            top={0}
                                            cursor="pointer"
                                        />
                                        <Flex direction="column" align="center">
                                            <Icon as={FiUpload} boxSize={6} mb={2} color="gray.500" />
                                            <Text fontSize="sm" color="gray.600">
                                                {formData.role === "user" 
                                                    ? "Cliquez pour télécharger un fichier (PDF ou Image)"
                                                    : "Téléchargement disponible seulement pour les utilisateurs"}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500" mt={1}>
                                                Max. 5MB
                                            </Text>
                                        </Flex>
                                    </Box>
                                    {fileError && (
                                        <Text color="red.500" fontSize="sm" mt={1}>
                                            {fileError}
                                        </Text>
                                    )}
                                </FormControl>

                                <Button 
                                    colorScheme="blue" 
                                    type="submit" 
                                    width="full"
                                    size="lg"
                                    mt={4}
                                    isLoading={isSubmitting}
                                    loadingText="Création en cours..."
                                >
                                    Créer l'utilisateur
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
