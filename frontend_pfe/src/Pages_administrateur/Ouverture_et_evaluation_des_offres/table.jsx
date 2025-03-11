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
} from "@chakra-ui/react";
import axios from "axios";

const DynamicTable = () => {
  const initialGroupCount = 3;
  const [groupCount, setGroupCount] = useState(initialGroupCount);
  const [products, setProducts] = useState([]);
  const { projectName } = useParams();

  const initialColumns = 2 + initialGroupCount * 2;
  const [tableData, setTableData] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(initialColumns).fill(""))
  );

  const addRow = () => {
    const newRow = Array(2 + groupCount * 2).fill("");
    setTableData([...tableData, newRow]);
  };

  const addGroup = () => {
    setGroupCount((prev) => prev + 1);
    setTableData(tableData.map((row) => [...row, "", ""]));
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/data?projectName=${projectName}`
      );
      setProducts(response.data);
      console.log("Produits récupérés :", response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };

  useEffect(() => {
    fetchProducts();
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
        newData[rowIndex][totalPriceIndex] = globalQuantity * unitPrice;
      }
    }
    else if (colIndex >= 2 && (colIndex - 2) % 2 === 0) {
      const globalQuantity = parseFloat(newData[rowIndex][1]) || 0;
      const unitPrice = parseFloat(value) || 0;
      const totalPriceIndex = colIndex + 1;
      newData[rowIndex][totalPriceIndex] = globalQuantity * unitPrice;
    }
    setTableData(newData);
  };

  const totals = Array.from({ length: groupCount }).map((_, groupIndex) => {
    return tableData.reduce((acc, row) => {
      const totalPriceIndex = 2 + groupIndex * 2 + 1;
      const cellValue = parseFloat(row[totalPriceIndex]) || 0;
      return acc + cellValue;
    }, 0);
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
                <Text mt={2}> الكمية</Text>
              </Th>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <Th key={groupIndex} colSpan={2} textAlign="center">
                  <Input border="1px solid gray" placeholder="Fournisseur" mt={2} />
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

              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td colSpan={1} textAlign="right">
                    العرض المالي "المجموع"
                  </Td>
                  <Td textAlign="center">{totals[groupIndex]}</Td>
                </React.Fragment>
              ))}
            </Tr>
          </Tfoot>
          <Tfoot>
            <Tr>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td colSpan={2} textAlign="right">
                    <Flex flexDir="column">
                      <label>نقطة مدة الانجاز</label>
                      <Input placeholder=" نقطة مدة الانجاز" textAlign="right" />
                    </Flex>
                  </Td>
                  <Td textAlign="center"></Td>
                </React.Fragment>
              ))}
            </Tr>
          </Tfoot>
          <Tfoot>
            <Tr>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td colSpan={2} textAlign="right">
                    <Flex flexDir="column">
                      <label>نقطة مدة الضمان</label>
                      <Input border="1px solid gray" placeholder=" نقطة مدة الضمان" textAlign="right" />
                    </Flex>
                  </Td>
                  <Td textAlign="center"></Td>
                </React.Fragment>
              ))}
            </Tr>
          </Tfoot>
          <Tfoot>
            <Tr>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td colSpan={2} textAlign="right">
                    <Flex flexDir="column">
                      <label>نقطة العرض المالي</label>
                      <Input border="1px solid gray" placeholder=" نقطة العرض المالي" textAlign="right" />
                    </Flex>
                  </Td>
                  <Td textAlign="center"></Td>
                </React.Fragment>
              ))}
            </Tr>
          </Tfoot>
          <Tfoot>
            <Tr>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td colSpan={2} textAlign="right">
                    <Flex flexDir="column">
                      <label>الترتيب</label>
                      <Input border="1px solid gray" placeholder="" textAlign="right" />
                    </Flex>
                  </Td>
                  <Td textAlign="center"></Td>
                </React.Fragment>
              ))}
            </Tr>
          </Tfoot>
          <Tfoot>
            <Tr>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td colSpan={2} textAlign="right">
                    <Input border="1px solid gray" placeholder=" مدة الانجاز" textAlign="right" />
                  </Td>
                  <Td textAlign="center"></Td>
                </React.Fragment>
              ))}
            </Tr>
          </Tfoot>
          <Tfoot>
            <Tr>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td colSpan={2} textAlign="right">
                    <Input border="1px solid gray" placeholder=" مدة الضمان" textAlign="right" />
                  </Td>
                  <Td textAlign="center"></Td>
                </React.Fragment>
              ))}
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      <Button onClick={addRow} mr={2} colorScheme="teal">
        Ajouter Ligne
      </Button>
      <Button onClick={addGroup} colorScheme="blue">
        Ajouter Fournisseur
      </Button>
    </Box>
  );
};

export default DynamicTable;
