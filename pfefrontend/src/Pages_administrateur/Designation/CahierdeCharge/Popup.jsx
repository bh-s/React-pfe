import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  IconButton,
  HStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Popup() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchParams] = useSearchParams();
  const projectTitle = searchParams.get("project");
  const toast = useToast();
  const [lots, setLots] = useState([]);
  const [evaluationCriteria, setEvaluationCriteria] = useState({});
  const [currentLotIndex, setCurrentLotIndex] = useState(0);

  useEffect(() => {
    if (isOpen && projectTitle) {
      // Fetch lots
      fetch(`${API_URL}/data?projectName=${projectTitle}`)
        .then(res => res.json())
        .then(data => {
          const uniqueLots = [...new Set(data.map(item => item.titre_ration))];
          setLots(uniqueLots);
        });

      // Fetch existing evaluation criteria
      fetch(`${API_URL}/${projectTitle}/getevaluation`)
        .then(res => res.json())
        .then(data => {
          const criteriaByLot = {};
          if (data && data.length > 0) {
            data.forEach(item => {
              criteriaByLot[item.lotName] = {
                finance: item.finance,
                duration: item.duration,
                guarantees: item.guarantees,
                _id: item._id
              };
            });
          }
          setEvaluationCriteria(criteriaByLot);
        });
    }
  }, [isOpen, projectTitle]);

  const handleChange = (lotName, field, value) => {
    setEvaluationCriteria(prev => ({
      ...prev,
      [lotName]: {
        ...prev[lotName],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      for (const [lotName, criteria] of Object.entries(evaluationCriteria)) {
        const total = Number(criteria.finance) + Number(criteria.duration) + Number(criteria.guarantees);
        
        if (total !== 100) {
          toast({
            title: `مجموع النقاط للحصة ${lotName} يجب أن يكون 100!`,
            status: "error",
            duration: 3000,
          });
          return;
        }

        const payload = {
          ...criteria,
          lotName,
          projectName: projectTitle,
        };

        const url = criteria._id 
          ? `${API_URL}/${projectTitle}/evaluation/${criteria._id}`
          : `${API_URL}/${projectTitle}/putevaluation`;
        
        const response = await fetch(url, {
          method: criteria._id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`Error saving criteria for lot ${lotName}`);
      }
      
      toast({ title: "تم حفظ جميع المعايير!", status: "success", duration: 2000 });
      onClose();
    } catch (error) {
      console.error("Error saving criteria:", error);
      toast({ title: "حدث خطأ أثناء الحفظ", status: "error", duration: 2000 });
    }
  };

  const handleNext = () => {
    setCurrentLotIndex(prev => Math.min(prev + 1, lots.length - 1));
  };

  const handlePrevious = () => {
    setCurrentLotIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <>
      <Button bgColor="#3e56dee7" _hover="none" mt={2} color="white" onClick={onOpen}>
        Critères d'évaluation
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent p={4} textAlign="center" fontFamily="Tajawal, sans-serif">
          <ModalHeader fontSize="2xl" fontWeight="bold">
            {projectTitle} : معايير تقييم العروض
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {lots.length > 0 && (
              <>
                <HStack justify="center" mb={4}>
                  <IconButton
                    icon={<ChevronRightIcon />}
                    onClick={handlePrevious}
                    isDisabled={currentLotIndex === 0}
                    aria-label="Previous lot"
                  />
                  <Text fontWeight="bold" mx={4}>
                    {lots[currentLotIndex]} - {currentLotIndex + 1}/{lots.length}
                  </Text>
                  <IconButton
                    icon={<ChevronLeftIcon />}
                    onClick={handleNext}
                    isDisabled={currentLotIndex === lots.length - 1}
                    aria-label="Next lot"
                  />
                </HStack>

                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontWeight="bold" textAlign="right">نقطة أجل التسليم</FormLabel>
                    <Input
                      name="finance"
                      border="1px solid gray"
                      placeholder="/100"
                      value={evaluationCriteria[lots[currentLotIndex]]?.finance || ""}
                      onChange={(e) => handleChange(lots[currentLotIndex], "finance", e.target.value)}
                      textAlign="right"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="bold" textAlign="right">مدة الضمان</FormLabel>
                    <Input
                      border="1px solid gray"
                      name="duration"
                      placeholder="/100"
                      value={evaluationCriteria[lots[currentLotIndex]]?.duration || ""}
                      onChange={(e) => handleChange(lots[currentLotIndex], "duration", e.target.value)}
                      textAlign="right"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="bold" textAlign="right">نقطة العرض المالي</FormLabel>
                    <Input
                      border="1px solid gray"
                      name="guarantees"
                      placeholder="/100"
                      value={evaluationCriteria[lots[currentLotIndex]]?.guarantees || ""}
                      onChange={(e) => handleChange(lots[currentLotIndex], "guarantees", e.target.value)}
                      textAlign="right"
                    />
                  </FormControl>
                </VStack>
              </>
            )}
          </ModalBody>

          <ModalFooter justifyContent="space-between">
            <Button colorScheme="red" variant="outline" onClick={onClose}>
              إغلاق
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              حفظ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
