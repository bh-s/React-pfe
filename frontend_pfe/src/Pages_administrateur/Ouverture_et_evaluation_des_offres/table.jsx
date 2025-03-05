import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";

const TableEvaluation = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      company: "شركة ABC",
      price: "1,500,000",
      duration: "6 أشهر",
      guarantees: "ضمان مصرفي 95%",
      technicalEvaluation: 85,
      financialEvaluation: 90,
      finalScore: 87.5,
    },
    {
      id: 2,
      company: "شركة XYZ",
      price: "1,450,000",
      duration: "5 أشهر",
      guarantees: "ضمان مصرفي 10%",
      technicalEvaluation: 80,
      financialEvaluation: 95,
      finalScore: 87.5,
    },
    {
      id: 3,
      company: "شركة LMN",
      price: "1,600,000",
      duration: "7 أشهر",
      guarantees: "شيك مصرفي 95%",
      technicalEvaluation: 78,
      financialEvaluation: 85,
      finalScore: 81.5,
    },
  ]);

  const [newOffer, setNewOffer] = useState({
    company: "",
    price: "",
    duration: "",
    guarantees: "",
    technicalEvaluation: "",
    financialEvaluation: "",
    finalScore: "",
  });

  const handleChange = (e) => {
    setNewOffer({ ...newOffer, [e.target.name]: e.target.value });
  };

  const addOffer = () => {
    if (
      newOffer.company &&
      newOffer.price &&
      newOffer.duration &&
      newOffer.guarantees &&
      newOffer.technicalEvaluation &&
      newOffer.financialEvaluation &&
      newOffer.finalScore
    ) {
      setOffers([
        ...offers,
        {
          id: offers.length + 1,
          ...newOffer,
          technicalEvaluation: Number(newOffer.technicalEvaluation),
          financialEvaluation: Number(newOffer.financialEvaluation),
          finalScore: Number(newOffer.finalScore),
        },
      ]);
      setNewOffer({
        company: "",
        price: "",
        duration: "",
        guarantees: "",
        technicalEvaluation: "",
        financialEvaluation: "",
        finalScore: "",
      });
    } else {
      alert("الرجاء ملء جميع الحقول!");
    }
  };

  return (
    <Box p={6} w="100%" maxW="1200px" mx="auto">
      <Heading size="lg" textAlign="center" mb={4}>
        تقييم العروض
      </Heading>

      {/* Table Section */}
      <TableContainer border="1px solid #ddd" borderRadius="md" overflowX="auto" mb={6}>
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th textAlign="center">رقم العرض</Th>
              <Th textAlign="center">اسم العارض</Th>
              <Th textAlign="center">السعر المقترح (بالدينار)</Th>
              <Th textAlign="center">مدة التنفيذ</Th>
              <Th textAlign="center">الضمانات المقدمة</Th>
              <Th textAlign="center">التقييم الفني (100/)</Th>
              <Th textAlign="center">التقييم المالي (100/)</Th>
              <Th textAlign="center">التنقيط النهائي (100/)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {offers.map((offer) => (
              <Tr key={offer.id} textAlign="center">
                <Td textAlign="center">{offer.id}</Td>
                <Td textAlign="center">{offer.company}</Td>
                <Td textAlign="center">{offer.price}</Td>
                <Td textAlign="center">{offer.duration}</Td>
                <Td textAlign="center">{offer.guarantees}</Td>
                <Td textAlign="center">{offer.technicalEvaluation}</Td>
                <Td textAlign="center">{offer.financialEvaluation}</Td>
                <Td textAlign="center">{offer.finalScore}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Add Offer Form */}
      <Box border="1px solid #ddd" p={4} borderRadius="md">
        <Heading size="md" textAlign="center" mb={4}>
          إضافة عرض جديد
        </Heading>
        <VStack spacing={3}>
          <FormControl>
            <FormLabel>اسم العارض</FormLabel>
            <Input name="company" value={newOffer.company} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>السعر المقترح (بالدينار)</FormLabel>
            <Input name="price" value={newOffer.price} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>مدة التنفيذ</FormLabel>
            <Input name="duration" value={newOffer.duration} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>الضمانات المقدمة</FormLabel>
            <Input name="guarantees" value={newOffer.guarantees} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>التقييم الفني (100/)</FormLabel>
            <Input
              type="number"
              name="technicalEvaluation"
              value={newOffer.technicalEvaluation}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>التقييم المالي (100/)</FormLabel>
            <Input
              type="number"
              name="financialEvaluation"
              value={newOffer.financialEvaluation}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>التنقيط النهائي (100/)</FormLabel>
            <Input
              type="number"
              name="finalScore"
              value={newOffer.finalScore}
              onChange={handleChange}
            />
          </FormControl>
          <Button colorScheme="blue" onClick={addOffer} w="full">
            إضافة العرض
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default TableEvaluation; 
