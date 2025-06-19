import { useState } from 'react';
import {
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    IconButton,
    Tooltip,
    HStack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    Input,

} from '@chakra-ui/react';

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
    Image as ImageIcon,
    Link2,
    Table as TableIcon,
    PaintBucket,
    Type,
    Pilcrow
} from 'lucide-react';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const [fontSize, setFontSize] = useState('16');
    const [fontColor, setFontColor] = useState('#000000');
    const [linkUrl, setLinkUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const addImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl('');
        }
    };

    const addLink = () => {
        if (linkUrl) {
            editor.chain().focus().toggleLink({ href: linkUrl }).run();
            setLinkUrl('');
        }
    };

    const addTable = () => {
        editor.chain().focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
    };

    const fontFamilies = [
        { label: 'Normal', value: '' },
        { label: 'Arial', value: 'Arial' },
        { label: 'Times New Roman', value: 'Times New Roman' },
        { label: 'Courier New', value: 'Courier New' },
        { label: 'Georgia', value: 'Georgia' },
        { label: 'Verdana', value: 'Verdana' },
    ];

    return (
        <HStack spacing={2} p={2} bg="white" borderBottom="1px" borderColor="gray.200" flexWrap="wrap">
            <Tooltip label="Police">
                <Box>
                    <Menu>
                        <MenuButton as={IconButton} icon={<Type size={20} />} variant="ghost" />
                        <MenuList>
                            {fontFamilies.map((font) => (
                                <MenuItem
                                    key={font.value}
                                    onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
                                    fontFamily={font.value || 'inherit'}
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
                                    editor.chain().focus().setFontSize(`${e.target.value}px`).run();
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
                        <IconButton
                            icon={<PaintBucket size={20} />}
                            variant="ghost"
                        />
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
                    colorScheme={editor.isActive('bold') ? 'blue' : 'gray'}
                    variant="ghost"
                />
            </Tooltip>

            <Tooltip label="Italique">
                <IconButton
                    icon={<Italic size={20} />}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    colorScheme={editor.isActive('italic') ? 'blue' : 'gray'}
                    variant="ghost"
                />
            </Tooltip>

            <Tooltip label="Souligné">
                <IconButton
                    icon={<UnderlineIcon size={20} />}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    colorScheme={editor.isActive('underline') ? 'blue' : 'gray'}
                    variant="ghost"
                />
            </Tooltip>

            <Tooltip label="Titre 1">
                <IconButton
                    icon={<Heading1 size={20} />}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    colorScheme={editor.isActive('heading', { level: 1 }) ? 'blue' : 'gray'}
                    variant="ghost"
                />
            </Tooltip>

            <Tooltip label="Titre 2">
                <IconButton
                    icon={<Heading2 size={20} />}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    colorScheme={editor.isActive('heading', { level: 2 }) ? 'blue' : 'gray'}
                    variant="ghost"
                />
            </Tooltip>

            <Tooltip label="Liste à puces">
                <IconButton
                    icon={<List size={20} />}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    colorScheme={editor.isActive('bulletList') ? 'blue' : 'gray'}
                    variant="ghost"
                />
            </Tooltip>

            <Tooltip label="Liste numérotée">
                <IconButton
                    icon={<ListOrdered size={20} />}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    colorScheme={editor.isActive('orderedList') ? 'blue' : 'gray'}
                    variant="ghost"
                />
            </Tooltip>

            <Tooltip label="Aligner à gauche">
                <IconButton
                    icon={<AlignLeft size={20} />}
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    colorScheme={editor.isActive({ textAlign: 'left' }) ? 'blue' : 'gray'}
                    variant="ghost"
                />
            </Tooltip>

            <Tooltip label="Aligner au centre">
                <IconButton
                    icon={<AlignCenter size={20} />}
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    colorScheme={editor.isActive({ textAlign: 'center' }) ? 'blue' : 'gray'}
                    variant="ghost"
                />
            </Tooltip>

            <Tooltip label="Aligner à droite">
                <IconButton
                    icon={<AlignRight size={20} />}
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    colorScheme={editor.isActive({ textAlign: 'right' }) ? 'blue' : 'gray'}
                    variant="ghost"
                />
            </Tooltip>

            <Tooltip label="Insérer un lien">
                <Popover>
                    <PopoverTrigger>
                        <IconButton
                            icon={<Link2 size={20} />}
                            variant="ghost"
                            colorScheme={editor.isActive('link') ? 'blue' : 'gray'}
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
export default MenuBar