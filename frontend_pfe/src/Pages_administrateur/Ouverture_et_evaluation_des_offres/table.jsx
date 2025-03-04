import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading, Box } from "@chakra-ui/react";

const TableEvaluation = () => {
  const offers = [
    {
      id: 1,
      company: "شركة ABC",
      price: "1,500,000",
      duration: "6 أشهر",
      guarantees: "ضمان مصرفي 95%",
      quantity:80,
      technicalEvaluation: 85,
      financialEvaluation: 90,
      finalScore: 87.5,
      total:80,
    },
    {
      id: 2,
      company: "شركة XYZ",
      price: "1,450,000",
      duration: "5 أشهر",
      quantity:70,
      guarantees: "ضمان مصرفي 10%",
      technicalEvaluation: 80,
      financialEvaluation: 95,
      finalScore: 87.5,
      total:80,
    },
    {
      id: 3,
      company: "شركة LMN",
      price: "1,600,000",
      duration: "7 أشهر",
      quantity:60,
      guarantees: "شيك مصرفي 95%",
      technicalEvaluation: 78,
      financialEvaluation: 85,
      finalScore: 81.5,
      total:80,
    },
  ];

  return (
    <Box p={6} w="100%" maxW="1200px" mx="auto">
      <Heading size="lg" textAlign="center" mb={4}>
        تقييم العروض
      </Heading>
      <TableContainer border="1px solid #ddd" borderRadius="md" overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th textAlign="center">رقم العرض</Th>
              <Th textAlign="center">اسم العارض</Th>
              <Th textAlign="center">الكمية</Th>
              <Th textAlign="center">السعر المقترح (بالدينار)</Th>
              <Th textAlign="center">مدة التنفيذ</Th>
              <Th textAlign="center">الضمانات المقدمة</Th>
              <Th textAlign="center">التقييم الفني (100/)</Th>
              <Th textAlign="center">التقييم المالي (100/)</Th>
              <Th textAlign="center">التنقيط النهائي (100/)</Th>
              <Th textAlign="center">المجموع</Th>
            </Tr>
          </Thead>
          <Tbody>
            {offers.map((offer) => (
              <Tr key={offer.id} textAlign="center">
                <Td textAlign="center">{offer.id}</Td>
                <Td textAlign="center">{offer.company}</Td>
                <Td textAlign="center">{offer.price}</Td>
                <Td textAlign="center">{offer.quantity}</Td>
                <Td textAlign="center">{offer.duration}</Td>
                <Td textAlign="center">{offer.guarantees}</Td>
                <Td textAlign="center">{offer.technicalEvaluation}</Td>
                <Td textAlign="center">{offer.financialEvaluation}</Td>
                <Td textAlign="center">{offer.finalScore}</Td>
                <Td textAlign="center">{offer.total}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableEvaluation;
