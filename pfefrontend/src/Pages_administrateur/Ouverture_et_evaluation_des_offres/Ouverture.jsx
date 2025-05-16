import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Menu,
    Avatar,
    MenuButton,
    MenuList,
    MenuItem,
    TableContainer,
    Flex,
    Input,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import { FaTrashAlt, FaSave } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/sidebar';
import { NavLink } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const Ouverture = () => {
    const { projectName } = useParams();
    const navigate = useNavigate();
    const history = useNavigate();
    const email = localStorage.getItem('email');
    const [rows, setRows] = useState([]);
    const [newRow, setNewRow] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const cancelRef = React.useRef();

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
    }, [projectName]);

    const handleAction1 = () => {
        navigate(`/ouverture_et_evaluation_des_offres/${projectName}/ouverture`);
    };

    const handleAction2 = () => {
        navigate(`/ouverture_et_evaluation_des_offres/${projectName}/evaluation`);
    };

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        history('/');
    };

    const addRow = () => {
        const emptyRow = {
            assuranceCertificate: '',
            workerCount: '',
            equipmentQuantity: '',
            executionCertificate: '',
            financialFile: { unitPriceTable: '', quantityEstimation: '', totalPriceWithTax: '' },
            technicalFile: { technicalNote: '', specificationBook: '' },
            submissionFile: { companyStatutes: '', authorizationDocs: '' },
            candidateName: '',
            isNew: true
        };
        setNewRow(emptyRow);
    };

    const saveRow = async (row) => {
        try {
            const token = localStorage.getItem('token');
            const url = row._id
                ? `${import.meta.env.VITE_API_URL}/${projectName}/ouverture/${row._id}`
                : `${import.meta.env.VITE_API_URL}/${projectName}/ouverture`;

            const method = row._id ? 'PUT' : 'POST';

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

    const handleDeleteClick = (id) => {
        setRowToDelete(id);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        await deleteRow(rowToDelete);
        setIsDeleteOpen(false);
        setRowToDelete(null);
    };

    const handleDeleteCancel = () => {
        setIsDeleteOpen(false);
        setRowToDelete(null);
    };

    return (
        <>
            <Sidebar />
            <main>
                <div className="NavBar">
                    <NavLink to="/besoins" className="Titles">
                        Dashboard
                    </NavLink>
                    <div className="avatar" id="logoAvatar" style={{ display: 'flex', position: 'fixed' }}>
                        <div style={{ marginRight: '20px', marginTop: '12px' }}>
                            <select style={{ padding: '5px', fontSize: '15px', borderRadius: '20px' }}>
                                <option>Langue</option>
                                <option>Arabe</option>
                                <option>Français</option>
                            </select>
                        </div>
                        <Menu>
                            <MenuButton
                                as={Avatar}
                                style={{
                                    height: '33px',
                                    borderRadius: '90px',
                                    cursor: 'pointer',
                                    marginRight: '-27px',
                                    marginTop: '10px',
                                    backgroundColor: '#11047A',
                                }}
                                src="https://bit.ly/broken-link"
                            />
                            <MenuList style={{ borderRadius: '5px', border: '1px solid #cccccc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)' }}>
                                <MenuItem style={{ backgroundColor: 'white', padding: '15px', fontSize: '16px' }}>
                                    {email}
                                </MenuItem>
                                <MenuItem
                                    onClick={handleLogout}
                                    style={{ color: '#F87272', backgroundColor: 'white', padding: '10px', fontSize: '16px' }}
                                >
                                    <FaSignOutAlt style={{ marginRight: '5px' }} />
                                    <span>Logout</span>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                </div>
                <Box mt={10} p={5}>
                    <Flex justifyContent="center" alignItems="center" gap={10}>
                        <Button p={6} _hover="none" bgColor="teal" fontSize="20px" fontFamily="serif" color="white" borderRadius={30} onClick={handleAction1}>
                            Procès-verbal d’ouverture
                        </Button>
                        <Button p={6} _hover="none" bgColor="teal" fontSize="20px" fontFamily="serif" color="white" borderRadius={30} onClick={handleAction2}>
                            Evaluation des offres
                        </Button>
                    </Flex>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', margin: '30px 0', color: '#2D3748' }}>
                        {projectName}: محضر لجنة فتح الأظرفة
                    </h1>
                    <TableContainer 
                        bgColor="white" 
                        p={6} 
                        borderRadius="lg" 
                        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    >
                        <Table variant="simple" mt={5}>
                            <Tbody>
                                <Tr bgColor="#F7FAFC">
                                    <Th rowSpan={2} textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">شهادة التأمين</Th>
                                    <Th rowSpan={2} textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">عدد العمال</Th>
                                    <Th rowSpan={2} textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">كمية العتاد</Th>
                                    <Th rowSpan={2} textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">شهادة حسن التنفيذ</Th>
                                    <Th colSpan={3} textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">الملف المالي</Th>
                                    <Th colSpan={2} textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">الملف التقني</Th>
                                    <Th colSpan={2} textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">ملف الترشح</Th>
                                    <Th rowSpan={2} textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">المترشح</Th>
                                </Tr>
                                <Tr bgColor="#F7FAFC">
                                    <Th textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">جدول الأسعار الوحدوي</Th>
                                    <Th textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">الكشف الكمي والتقديري</Th>
                                    <Th textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">المبلغ بكل الرسوم</Th>
                                    <Th textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">مذكرة تقنية</Th>
                                    <Th textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">دفتر الشروط</Th>
                                    <Th textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">القانون الأساسي للشركة</Th>
                                    <Th textAlign="center" color="#2D3748" fontSize="14px" borderBottom="2px solid #E2E8F0">وثائق التفويض</Th>
                                </Tr>

                                {rows.map((row) => (
                                    <Tr key={row._id} _hover={{ bgColor: "#F7FAFC" }}>
                                        <Td>
                                            <Input
                                                value={row.assuranceCertificate}
                                                onChange={(e) => handleInputChange(e.target.value, 'assuranceCertificate', null, row._id)}
                                                size="sm"
                                                borderRadius="md"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow: "0 0 0 1px teal.500"
                                                }}
                                            />
                                        </Td>
                                        <Td>
                                            <Input
                                                value={row.workerCount}
                                                onChange={(e) => handleInputChange(e.target.value, 'workerCount', null, row._id)}
                                                size="sm"
                                                borderRadius="md"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow: "0 0 0 1px teal.500"
                                                }}
                                            />
                                        </Td>
                                        <Td>
                                            <Input
                                                value={row.equipmentQuantity}
                                                onChange={(e) => handleInputChange(e.target.value, 'equipmentQuantity', null, row._id)}
                                                size="sm"
                                                borderRadius="md"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow: "0 0 0 1px teal.500"
                                                }}
                                            />
                                        </Td>
                                        <Td>
                                            <Input
                                                value={row.executionCertificate}
                                                onChange={(e) => handleInputChange(e.target.value, 'executionCertificate', null, row._id)}
                                                size="sm"
                                                borderRadius="md"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow: "0 0 0 1px teal.500"
                                                }}
                                            />
                                        </Td>

                                        <Td>
                                            <Input
                                                value={row.financialFile?.unitPriceTable}
                                                onChange={(e) => handleInputChange(e.target.value, 'financialFile', 'unitPriceTable', row._id)}
                                                size="sm"
                                                borderRadius="md"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow: "0 0 0 1px teal.500"
                                                }}
                                            />
                                        </Td>
                                        <Td>
                                            <Input
                                                value={row.financialFile?.quantityEstimation}
                                                onChange={(e) => handleInputChange(e.target.value, 'financialFile', 'quantityEstimation', row._id)}
                                                size="sm"
                                                borderRadius="md"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow: "0 0 0 1px teal.500"
                                                }}
                                            />
                                        </Td>
                                        <Td>
                                            <Input
                                                value={row.financialFile?.totalPriceWithTax}
                                                onChange={(e) => handleInputChange(e.target.value, 'financialFile', 'totalPriceWithTax', row._id)}
                                                size="sm"
                                                borderRadius="md"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow: "0 0 0 1px teal.500"
                                                }}
                                            />
                                        </Td>

                                        <Td>
                                            <Input
                                                value={row.technicalFile?.technicalNote}
                                                onChange={(e) => handleInputChange(e.target.value, 'technicalFile', 'technicalNote', row._id)}
                                                size="sm"
                                                borderRadius="md"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow: "0 0 0 1px teal.500"
                                                }}
                                            />
                                        </Td>
                                        <Td>
                                            <Input
                                                value={row.technicalFile?.specificationBook}
                                                onChange={(e) => handleInputChange(e.target.value, 'technicalFile', 'specificationBook', row._id)}
                                                size="sm"
                                                borderRadius="md"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow: "0 0 0 1px teal.500"
                                                }}
                                            />
                                        </Td>

                                        <Td>
                                            <Input
                                                value={row.submissionFile?.companyStatutes}
                                                onChange={(e) => handleInputChange(e.target.value, 'submissionFile', 'companyStatutes', row._id)}
                                                size="sm"
                                                borderRadius="md"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow: "0 0 0 1px teal.500"
                                                }}
                                            />
                                        </Td>
                                        <Td>
                                            <Input
                                                value={row.submissionFile?.authorizationDocs}
                                                onChange={(e) => handleInputChange(e.target.value, 'submissionFile', 'authorizationDocs', row._id)}
                                                size="sm"
                                                borderRadius="md"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow: "0 0 0 1px teal.500"
                                                }}
                                            />
                                        </Td>
                                        <Td>
                                            <Input
                                                value={row.candidateName}
                                                onChange={(e) => handleInputChange(e.target.value, 'candidateName', null, row._id)}
                                                size="sm"
                                                borderRadius="md"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow: "0 0 0 1px teal.500"
                                                }}
                                            />
                                        </Td>

                                        <Td>
                                            <Flex gap={2}>
                                                <Button 
                                                    colorScheme="teal" 
                                                    size="sm" 
                                                    onClick={() => saveRow(row)}
                                                    _hover={{ transform: 'translateY(-1px)' }}
                                                    transition="all 0.2s"
                                                >
                                                    <FaSave color="white" size="1rem" />
                                                </Button>
                                                <Button 
                                                    colorScheme="red" 
                                                    size="sm" 
                                                    onClick={() => handleDeleteClick(row._id)}
                                                    _hover={{ transform: 'translateY(-1px)' }}
                                                    transition="all 0.2s"
                                                >
                                                    <FaTrashAlt color="white" size="1rem" />
                                                </Button>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                ))}

                                {newRow && (
                                    <Tr _hover={{ bgColor: "#F7FAFC" }}>
                                        <Td><Input value={newRow.assuranceCertificate} onChange={(e) => setNewRow({ ...newRow, assuranceCertificate: e.target.value })} size="sm" borderRadius="md" _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }} /></Td>
                                        <Td><Input value={newRow.workerCount} onChange={(e) => setNewRow({ ...newRow, workerCount: e.target.value })} size="sm" borderRadius="md" _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }} /></Td>
                                        <Td><Input value={newRow.equipmentQuantity} onChange={(e) => setNewRow({ ...newRow, equipmentQuantity: e.target.value })} size="sm" borderRadius="md" _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }} /></Td>
                                        <Td><Input value={newRow.executionCertificate} onChange={(e) => setNewRow({ ...newRow, executionCertificate: e.target.value })} size="sm" borderRadius="md" _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }} /></Td>

                                        <Td><Input value={newRow.financialFile.unitPriceTable} onChange={(e) => setNewRow({ ...newRow, financialFile: { ...newRow.financialFile, unitPriceTable: e.target.value } })} size="sm" borderRadius="md" _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }} /></Td>
                                        <Td><Input value={newRow.financialFile.quantityEstimation} onChange={(e) => setNewRow({ ...newRow, financialFile: { ...newRow.financialFile, quantityEstimation: e.target.value } })} size="sm" borderRadius="md" _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }} /></Td>
                                        <Td><Input value={newRow.financialFile.totalPriceWithTax} onChange={(e) => setNewRow({ ...newRow, financialFile: { ...newRow.financialFile, totalPriceWithTax: e.target.value } })} size="sm" borderRadius="md" _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }} /></Td>

                                        <Td><Input value={newRow.technicalFile.technicalNote} onChange={(e) => setNewRow({ ...newRow, technicalFile: { ...newRow.technicalFile, technicalNote: e.target.value } })} size="sm" borderRadius="md" _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }} /></Td>
                                        <Td><Input value={newRow.technicalFile.specificationBook} onChange={(e) => setNewRow({ ...newRow, technicalFile: { ...newRow.technicalFile, specificationBook: e.target.value } })} size="sm" borderRadius="md" _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }} /></Td>

                                        <Td><Input value={newRow.submissionFile.companyStatutes} onChange={(e) => setNewRow({ ...newRow, submissionFile: { ...newRow.submissionFile, companyStatutes: e.target.value } })} size="sm" borderRadius="md" _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }} /></Td>
                                        <Td><Input value={newRow.submissionFile.authorizationDocs} onChange={(e) => setNewRow({ ...newRow, submissionFile: { ...newRow.submissionFile, authorizationDocs: e.target.value } })} size="sm" borderRadius="md" _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }} /></Td>
                                        <Td><Input value={newRow.candidateName} onChange={(e) => setNewRow({ ...newRow, candidateName: e.target.value })} size="sm" borderRadius="md" _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }} /></Td>

                                        <Td>
                                            <Flex gap={2}>
                                                <Button colorScheme="green" size="sm" onClick={() => saveRow(newRow)} mr={2} _hover={{ transform: 'translateY(-1px)' }} transition="all 0.2s">
                                                    <FaSave color="white" size="1rem" />
                                                </Button>
                                                <Button colorScheme="red" size="sm" onClick={() => setNewRow(null)} _hover={{ transform: 'translateY(-1px)' }} transition="all 0.2s">
                                                    <FaTrashAlt color="white" size="1rem" />
                                                </Button>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>

                    <Flex justifyContent="flex-end" p={6}>
                        <Button 
                            colorScheme="teal" 
                            onClick={addRow} 
                            leftIcon={<span>+</span>}
                            _hover={{ transform: 'translateY(-1px)' }}
                            transition="all 0.2s"
                            boxShadow="sm"
                        >
                            Ajouter une ligne
                        </Button>
                    </Flex>
                </Box>
            </main>

            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={handleDeleteCancel}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Confirmer la suppression
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Êtes-vous sûr de vouloir supprimer cette ligne ? Cette action est irréversible.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={handleDeleteCancel}>
                                Annuler
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                                Supprimer
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default Ouverture;