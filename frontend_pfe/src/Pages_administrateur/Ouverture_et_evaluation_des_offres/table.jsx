import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Button,
  Input,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const DynamicTable = () => {
  const toast = useToast();
  const initialGroupCount = 3;
  const [groupCount, setGroupCount] = useState(initialGroupCount);
  const [products, setProducts] = useState([]);
  const { projectName } = useParams();
  const [suppliers, setSuppliers] = useState(
    Array(initialGroupCount).fill({
      name: "",
      point_duree_execution: "",
      point_duree_garantie: "",
      point_offre_financiere: "",
      ordre: "",
      duree_execution: "",
      duree_garantie: ""
    })
  );

  const initialColumns = 2 + initialGroupCount * 2;
  const [tableData, setTableData] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(initialColumns).fill(""))
  );
  const [isSaving, setIsSaving] = useState(false);

  const addRow = () => {
    const newRow = Array(2 + groupCount * 2).fill("");
    setTableData([...tableData, newRow]);
  };

  const addGroup = () => {
    setGroupCount((prev) => prev + 1);
    setTableData(tableData.map((row) => [...row, "", ""]));
    setSuppliers([...suppliers, {
      name: "",
      point_duree_execution: "",
      point_duree_garantie: "",
      point_offre_financiere: "",
      ordre: "",
      duree_execution: "",
      duree_garantie: ""
    }]);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/data?projectName=${projectName}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const validateData = (data) => {
    if (!data.projectName) {
      throw new Error("Project name is required");
    }

    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error("Products array cannot be empty");
    }

    if (!Array.isArray(data.suppliers) || data.suppliers.length === 0) {
      throw new Error("Suppliers array cannot be empty");
    }

    return true;
  };

  const saveTableData = async () => {
    try {
      setIsSaving(true);
      const formattedData = {
        projectName: projectName || "default",
        products: tableData.map(row => ({
          titre_ration: row[0],
          quantity: parseFloat(row[1]) || 0,
          suppliers: Array.from({ length: groupCount }).map((_, index) => ({
            unitPrice: parseFloat(row[2 + index * 2]) || 0,
            totalPrice: parseFloat(row[3 + index * 2]) || 0
          }))
        })),
        suppliers: suppliers.map(supplier => ({
          name: supplier.name || "",
          point_duree_execution: supplier.point_duree_execution || "",
          point_duree_garantie: supplier.point_duree_garantie || "",
          point_offre_financiere: supplier.point_offre_financiere || "",
          ordre: supplier.ordre || "",
          duree_execution: supplier.duree_execution || "",
          duree_garantie: supplier.duree_garantie || ""
        }))
      };

      // Validate data before sending
      validateData(formattedData);

      console.log("Sending data:", JSON.stringify(formattedData, null, 2));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/dataEvaluation`,
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Server response:", response.data);

      toast({
        title: "Success",
        description: "Data saved successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving data:", error);
      let errorMessage = "Failed to save data";

      if (error.response) {
        console.error("Server error response:", error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (projectName) {
      fetchProducts();
    }
  }, [projectName]);

  useEffect(() => {
    if (products && products.length > 0) {
      const newData = products.map((product) => {
        const row = Array(2 + groupCount * 2).fill("");
        row[0] = product.titre_ration || "";
        row[1] = product.quantity || "";
        return row;
      });
      setTableData(newData);
    }
  }, [products, groupCount]);

  const handleInputChange = (rowIndex, colIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;

    if (colIndex === 1) {
      const globalQuantity = parseFloat(value) || 0;
      for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
        const unitPriceIndex = 2 + groupIndex * 2;
        const totalPriceIndex = unitPriceIndex + 1;
        const unitPrice = parseFloat(newData[rowIndex][unitPriceIndex]) || 0;
        newData[rowIndex][totalPriceIndex] = (globalQuantity * unitPrice).toFixed(2);
      }
    }
    else if (colIndex >= 2 && (colIndex - 2) % 2 === 0) {
      const globalQuantity = parseFloat(newData[rowIndex][1]) || 0;
      const unitPrice = parseFloat(value) || 0;
      const totalPriceIndex = colIndex + 1;
      newData[rowIndex][totalPriceIndex] = (globalQuantity * unitPrice).toFixed(2);
    }
    setTableData(newData);
  };

  const handleSupplierChange = (supplierIndex, field, value) => {
    const newSuppliers = [...suppliers];
    newSuppliers[supplierIndex] = {
      ...newSuppliers[supplierIndex],
      [field]: value
    };
    setSuppliers(newSuppliers);
  };

  const totals = Array.from({ length: groupCount }).map((_, groupIndex) => {
    return tableData.reduce((acc, row) => {
      const totalPriceIndex = 2 + groupIndex * 2 + 1;
      const cellValue = parseFloat(row[totalPriceIndex]) || 0;
      return acc + cellValue;
    }, 0).toFixed(2);
  });

  return (
    <Box p={6}>
      <TableContainer border="1px" borderColor="gray.200" mb={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th rowSpan={2} textAlign="center">
                <Text mt={2}>اللوازم</Text>
              </Th>
              <Th rowSpan={2} textAlign="center">
                <Text mt={2}>الكمية</Text>
              </Th>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <Th key={groupIndex} colSpan={2} textAlign="center">
                  <Input
                    border="1px solid gray"
                    placeholder="Fournisseur"
                    mt={2}
                    value={suppliers[groupIndex].name}
                    onChange={(e) => handleSupplierChange(groupIndex, 'name', e.target.value)}
                  />
                </Th>
              ))}
            </Tr>
            <Tr>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Th textAlign="center">السعر الوحدوي</Th>
                  <Th textAlign="center">السعر الكلي</Th>
                </React.Fragment>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <Td key={cellIndex}>
                    <Input
                      width="auto"
                      border="1px solid gray"
                      value={cell}
                      onChange={(e) =>
                        handleInputChange(rowIndex, cellIndex, e.target.value)
                      }
                      isReadOnly={
                        cellIndex >= 2 && (cellIndex - 2) % 2 === 1
                      }
                    />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    العرض المالي "المجموع"
                  </Td>
                  <Td textAlign="center">{totals[groupIndex]}</Td>
                </React.Fragment>
              ))}
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Flex flexDir="column">
                      <label>نقطة مدة الانجاز</label>
                      <Input
                        placeholder="نقطة مدة الانجاز"
                        textAlign="right"
                        value={suppliers[groupIndex].point_duree_execution}
                        onChange={(e) => handleSupplierChange(groupIndex, 'point_duree_execution', e.target.value)}
                      />
                    </Flex>
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Flex flexDir="column">
                      <label>نقطة مدة الضمان</label>
                      <Input
                        placeholder="نقطة مدة الضمان"
                        textAlign="right"
                        value={suppliers[groupIndex].point_duree_garantie}
                        onChange={(e) => handleSupplierChange(groupIndex, 'point_duree_garantie', e.target.value)}
                      />
                    </Flex>
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Flex flexDir="column">
                      <label>نقطة العرض المالي</label>
                      <Input
                        placeholder="نقطة العرض المالي"
                        textAlign="right"
                        value={suppliers[groupIndex].point_offre_financiere}
                        onChange={(e) => handleSupplierChange(groupIndex, 'point_offre_financiere', e.target.value)}
                      />
                    </Flex>
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Flex flexDir="column">
                      <label>الترتيب</label>
                      <Input
                        placeholder="الترتيب"
                        textAlign="right"
                        value={suppliers[groupIndex].ordre}
                        onChange={(e) => handleSupplierChange(groupIndex, 'ordre', e.target.value)}
                      />
                    </Flex>
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Input
                      placeholder="مدة الانجاز"
                      textAlign="right"
                      value={suppliers[groupIndex].duree_execution}
                      onChange={(e) => handleSupplierChange(groupIndex, 'duree_execution', e.target.value)}
                    />
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Input
                      placeholder="مدة الضمان"
                      textAlign="right"
                      value={suppliers[groupIndex].duree_garantie}
                      onChange={(e) => handleSupplierChange(groupIndex, 'duree_garantie', e.target.value)}
                    />
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      <Button onClick={addRow} mr={2} colorScheme="teal">
        Ajouter Ligne
      </Button>
      <Button onClick={addGroup} mr={2} colorScheme="blue">
        Ajouter Fournisseur
      </Button>
      <Button
        onClick={saveTableData}
        colorScheme="green"
        isLoading={isSaving}
        loadingText="Sauvegarde..."
      >
        Sauvegarder
      </Button>
    </Box>
  );
};

export default DynamicTable;