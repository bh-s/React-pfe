import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import {
    Box,
    Flex,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Avatar,
    Select,
    Button,
    useToast,
    VStack,
    HStack,

} from '@chakra-ui/react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import {
    Underline as UnderlineIcon,
    Save,
    Image as ImageIcon,

    Table as TableIcon,
} from 'lucide-react';
import { FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar/sidebar';
import MenuBar from './Menubar';
import Entete from './Entete';
import Section1 from './Section1';
import MarkdownViewer from './Markdownfile';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';


function Rapport() {
    const [projectName, setProjectName] = useState(useParams().projectName || "");
    const navigate = useNavigate();
    const toast = useToast();
    const email = localStorage.getItem('email');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            FontFamily,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
            }),
            ImageExtension,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: '',
        onUpdate: ({ editor }) => {
            localStorage.setItem('editorContent', editor.getHTML());
        },
    });

    const generateDocx = async () => {
        if (!editor) return;

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: "الجمهورية الجزائرية الديموقراطية الشعبية",
                                size: 24,
                                bold: true,
                            }),
                        ],
                    }),
                    new Paragraph({
                        text: editor.getHTML(),
                        heading: HeadingLevel.HEADING_1,
                    }),
                ]
            }]
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `rapport_${projectName || 'document'}.docx`);

        toast({
            title: "Succès",
            description: "Le rapport a été téléchargé avec succès",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        navigate("/");
    };

    return (
        <Box minH="100vh" bg="gray.50" display="flex">
            <Sidebar />
            <Box flex="1" overflow="auto">
                <Flex
                    as="header"
                    align="center"
                    justify="space-between"
                    p={4}
                    bg="white"
                    boxShadow="sm"
                >
                    <NavLink to="/besoins">
                        <Button variant="ghost">Dashboard</Button>
                    </NavLink>

                    <HStack spacing={4}>
                        <Select placeholder="Langue" w="120px" size="sm">
                            <option value="ar">Arabe</option>
                            <option value="fr">Français</option>
                        </Select>

                        <Menu>
                            <MenuButton
                                as={Avatar}
                                size="sm"
                                cursor="pointer"
                                bg="blue.600"
                                style={{ height: "33px", borderRadius: "90px", cursor: "pointer", marginRight: "-27px", marginTop: '10px', backgroundColor: '#11047A' }}
                            />
                            <MenuList>
                                <MenuItem>{email}</MenuItem>
                                <MenuItem onClick={handleLogout} color="red.500">
                                    <FaSignOutAlt style={{ marginRight: '8px' }} />
                                    Déconnexion
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                </Flex>

                <VStack spacing={6} p={8} align="stretch" maxW="1600px" mx="auto">
                    <main>
                        <MenuBar editor={editor} />
                        <Entete />
                        <Section1 />
                        <Section2/>
                        <Section3/>
                        <Section4/>
                        <Flex justify="end" gap={4}>
                            <Button
                                leftIcon={<Save size={20} />}
                                colorScheme="blue"
                                onClick={generateDocx}
                            >
                                Télécharger en Word
                            </Button>
                        </Flex>
                    </main>
                </VStack>
            </Box>
        </Box>
    );
}

export default Rapport;
