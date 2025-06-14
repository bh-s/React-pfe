import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import axios from "axios";
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
  IconButton,
  Tooltip,
  VStack,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Input,
  Text,
  Image,
} from "@chakra-ui/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Save,
  Image as ImageIcon,
  Link2,
  Table as TableIcon,
  PaintBucket,
  Type,
  Pilcrow,
} from "lucide-react";
import { FaSignOutAlt } from "react-icons/fa";
import Sidebar from "../../components/Sidebar/sidebar";
import logo from "../../Assets/Logo-UHBC-GO-final.jpg";
import mammoth from "mammoth";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const [fontSize, setFontSize] = useState("16");
  const [fontColor, setFontColor] = useState("#000000");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
    }
  };

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().toggleLink({ href: linkUrl }).run();
      setLinkUrl("");
    }
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const fontFamilies = [
    { label: "Normal", value: "" },
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
  ];

  return (
    <HStack
      spacing={2}
      p={2}
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      flexWrap="wrap"
    >
      <Tooltip label="Police">
        <Box>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<Type size={20} />}
              variant="ghost"
            />
            <MenuList>
              {fontFamilies.map((font) => (
                <MenuItem
                  key={font.value}
                  onClick={() =>
                    editor.chain().focus().setFontFamily(font.value).run()
                  }
                  fontFamily={font.value || "inherit"}
                >
                  {font.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </Tooltip>

      <Tooltip label="Taille de police">
        <Popover>
          <PopoverTrigger>
            <IconButton icon={<Pilcrow size={20} />} variant="ghost" />
          </PopoverTrigger>
          <PopoverContent width="200px">
            <PopoverBody p={4}>
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => {
                  setFontSize(e.target.value);
                  editor
                    .chain()
                    .focus()
                    .setFontSize(`${e.target.value}px`)
                    .run();
                }}
                min="8"
                max="72"
              />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Tooltip>

      <Tooltip label="Couleur du texte">
        <Popover>
          <PopoverTrigger>
            <IconButton icon={<PaintBucket size={20} />} variant="ghost" />
          </PopoverTrigger>
          <PopoverContent width="200px">
            <PopoverBody p={4}>
              <Input
                type="color"
                value={fontColor}
                onChange={(e) => {
                  setFontColor(e.target.value);
                  editor.chain().focus().setColor(e.target.value).run();
                }}
              />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Tooltip>

      <Tooltip label="Gras">
        <IconButton
          icon={<Bold size={20} />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          colorScheme={editor.isActive("bold") ? "blue" : "gray"}
          variant="ghost"
        />
      </Tooltip>

      <Tooltip label="Italique">
        <IconButton
          icon={<Italic size={20} />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          colorScheme={editor.isActive("italic") ? "blue" : "gray"}
          variant="ghost"
        />
      </Tooltip>

      <Tooltip label="Souligné">
        <IconButton
          icon={<UnderlineIcon size={20} />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          colorScheme={editor.isActive("underline") ? "blue" : "gray"}
          variant="ghost"
        />
      </Tooltip>

      <Tooltip label="Titre 1">
        <IconButton
          icon={<Heading1 size={20} />}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          colorScheme={
            editor.isActive("heading", { level: 1 }) ? "blue" : "gray"
          }
          variant="ghost"
        />
      </Tooltip>

      <Tooltip label="Titre 2">
        <IconButton
          icon={<Heading2 size={20} />}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          colorScheme={
            editor.isActive("heading", { level: 2 }) ? "blue" : "gray"
          }
          variant="ghost"
        />
      </Tooltip>

      <Tooltip label="Liste à puces">
        <IconButton
          icon={<List size={20} />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          colorScheme={editor.isActive("bulletList") ? "blue" : "gray"}
          variant="ghost"
        />
      </Tooltip>

      <Tooltip label="Liste numérotée">
        <IconButton
          icon={<ListOrdered size={20} />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          colorScheme={editor.isActive("orderedList") ? "blue" : "gray"}
          variant="ghost"
        />
      </Tooltip>

      <Tooltip label="Aligner à gauche">
        <IconButton
          icon={<AlignLeft size={20} />}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          colorScheme={editor.isActive({ textAlign: "left" }) ? "blue" : "gray"}
          variant="ghost"
        />
      </Tooltip>

      <Tooltip label="Aligner au centre">
        <IconButton
          icon={<AlignCenter size={20} />}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          colorScheme={
            editor.isActive({ textAlign: "center" }) ? "blue" : "gray"
          }
          variant="ghost"
        />
      </Tooltip>

      <Tooltip label="Aligner à droite">
        <IconButton
          icon={<AlignRight size={20} />}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          colorScheme={
            editor.isActive({ textAlign: "right" }) ? "blue" : "gray"
          }
          variant="ghost"
        />
      </Tooltip>

      <Tooltip label="Insérer un lien">
        <Popover>
          <PopoverTrigger>
            <IconButton
              icon={<Link2 size={20} />}
              variant="ghost"
              colorScheme={editor.isActive("link") ? "blue" : "gray"}
            />
          </PopoverTrigger>
          <PopoverContent width="300px">
            <PopoverBody p={4}>
              <Input
                placeholder="Entrez l'URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                mb={2}
              />
              <Button size="sm" colorScheme="blue" onClick={addLink}>
                Appliquer
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Tooltip>

      <Tooltip label="Insérer une image">
        <Popover>
          <PopoverTrigger>
            <IconButton icon={<ImageIcon size={20} />} variant="ghost" />
          </PopoverTrigger>
          <PopoverContent width="300px">
            <PopoverBody p={4}>
              <Input
                placeholder="Entrez l'URL de l'image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                mb={2}
              />
              <Button size="sm" colorScheme="blue" onClick={addImage}>
                Insérer
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Tooltip>

      <Tooltip label="Insérer un tableau">
        <IconButton
          icon={<TableIcon size={20} />}
          onClick={addTable}
          variant="ghost"
        />
      </Tooltip>
    </HStack>
  );
};

function Rapport() {
  const [projectName, setProjectName] = useState(useParams().projectName || "");
  const [preferDocx, setPreferDocx] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const email = localStorage.getItem("email");
  const [rapportData, setRapportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const loadDocxTemplate = async () => {
    try {
      const response = await fetch("/docs/rapport.docx");
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      return result.value;
    } catch (err) {
      console.error("Erreur chargement Word:", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger le fichier Word.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const projectNameFromQuery = new URLSearchParams(
          window.location.search
        ).get("project");
        const currentProjectName = projectNameFromQuery || projectName;
        setProjectName(currentProjectName);

        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/data?projectName=${currentProjectName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data) {
          setRapportData(response.data);
          if (editor) {
            editor.commands.setContent(
              preferDocx
                ? await loadDocxTemplate()
                : response.data.content || ""
            );
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          title: "Erreur",
          description: "Échec de la récupération des données",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectName, preferDocx]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
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
    content: "",
    onUpdate: ({ editor }) => {
      localStorage.setItem("editorContent", editor.getHTML());
    },
  });

  const generateDocx = async () => {
    if (!editor) return;

    const doc = new Document({
      sections: [
        {
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
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `rapport_${projectName || "document"}.docx`);

    toast({
      title: "Succès",
      description: "Le rapport a été téléchargé avec succès",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>Chargement...</Text>
      </Box>
    );
  }

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

          <HStack spacing={1}>
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
                style={{
                  height: "33px",
                  borderRadius: "90px",
                  cursor: "pointer",
                  marginRight: "-27px",
                  marginTop: "10px",
                  backgroundColor: "#11047A",
                }}
              />
              <MenuList>
                <MenuItem>{email}</MenuItem>
                <MenuItem onClick={handleLogout} color="red.500">
                  <FaSignOutAlt style={{ marginRight: "8px" }} />
                  Déconnexion
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        <VStack spacing={2} p={4} align="stretch" maxW="1600px" mx="auto">
          <main>
            <MenuBar editor={editor} />
            <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
              <Flex justify="space-between" align="center">
                <Box textAlign="left" flex={1}>
                  <Text fontWeight="bold" fontSize="lg">
                    République Algérienne Démocratique et Populaire
                  </Text>
                  <Text>Ministère de l'Enseignement Supérieur</Text>
                  <Text>Université Hassiba Benbouali de Chlef</Text>
                </Box>

                <Box w="120px" mx={8}>
                  <Image
                    src={logo}
                    alt="UHBC Logo"
                    w="full"
                    h="auto"
                    objectFit="contain"
                  />
                </Box>

                <Box textAlign="right" flex={1} dir="rtl">
                  <Text fontWeight="bold" fontSize="lg">
                    الجمهورية الجزائرية الديموقراطية الشعبية
                  </Text>
                  <Text>وزارة التعليم العالي و البحث العلمي</Text>
                  <Text>جامعة حسيبة بن بوعلي الشلف</Text>
                </Box>
              </Flex>
            </Box>

            <Box
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              overflow="hidden"
              mt={4}
            >
              <Box
                p={6}
                minH="400px"
                className="editor"
                sx={{
                  ".ProseMirror": {
                    minH: "1000px",
                    "&:focus": {
                      outline: "none",
                    },
                    "h1, h2, h3, h4, h5, h6": {
                      margin: "1rem 0",
                      fontSize: "2em",
                      fontWeight: "bold",
                      color: "#333",
                    },
                    p: {
                      margin: "0.5rem 0",
                      fontSize: "1.5em",
                      lineHeight: "1.6",
                      textAlign: "right",
                      fontFamily: "Times New Roman",
                    },
                    "ul, ol": {
                      paddingLeft: "1.5rem",
                      margin: "0.5rem 0",
                    },
                    table: {
                      borderCollapse: "collapse",
                      width: "100%",
                      margin: "1rem 0",
                      "th, td": {
                        border: "1px solid #000",
                        padding: "0.5rem",
                      },
                      th: {
                        backgroundColor: "#f7fafc",
                        fontWeight: "bold",
                      },
                    },
                  },
                }}
              >
                <EditorContent editor={editor} />
              </Box>
            </Box>

            <Flex justify="end" gap={4} mt={4}>
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
