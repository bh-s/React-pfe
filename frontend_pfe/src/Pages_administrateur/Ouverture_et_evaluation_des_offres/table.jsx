import { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";

const EvaluationTable = () => {
  const [suppliers, setSuppliers] = useState([{ quantities: "", price: "", total: 0 }]);

  const handleChange = (index, field, value) => {
    const updatedSuppliers = [...suppliers];
    updatedSuppliers[index][field] = value;
    if (field === "quantities" || field === "price") {
      updatedSuppliers[index].total =
        (updatedSuppliers[index].quantities || 0) * (updatedSuppliers[index].price || 0);
    }
    setSuppliers(updatedSuppliers);
  };

  const addSupplier = () => {
    setSuppliers([...suppliers, { quantities: "", price: "", total: 0 }]);
  };

  const totalSum = suppliers.reduce((sum, supplier) => sum + supplier.total, 0);

  return (
    <VStack spacing={4} p={4}>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Quantities</Th>
            <Th>Price</Th>
            <Th>Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {suppliers.map((supplier, index) => (
            <Tr key={index}>
              <Td>
                <Input
                  type="number"
                  value={supplier.quantities}
                  onChange={(e) => handleChange(index, "quantities", Number(e.target.value))}
                />
              </Td>
              <Td>
                <Input
                  type="number"
                  value={supplier.price}
                  onChange={(e) => handleChange(index, "price", Number(e.target.value))}
                />
              </Td>
              <Td>{supplier.total}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <HStack>
        <Text fontWeight="bold">Total: {totalSum}</Text>
      </HStack>
      <Button colorScheme="blue" onClick={addSupplier}>
        Ajouter
      </Button>
    </VStack>
  );
};

export default EvaluationTable;
