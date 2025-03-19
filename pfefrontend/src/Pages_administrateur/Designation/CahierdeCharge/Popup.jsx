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
  useToast
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Popup() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchParams] = useSearchParams();
  const projectTitle = searchParams.get("project");
  const toast = useToast();
  const [newOffer, setNewOffer] = useState({
    finance: "",
    duration: "",
    guarantees: "",
  });

  useEffect(() => {
    if (isOpen && projectTitle) {
      fetch(`${API_URL}/${projectTitle}/getevaluation`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setNewOffer({
              finance: data[0].finance,
              duration: data[0].duration,
              guarantees: data[0].guarantees,
              projectName: projectTitle,
              _id: data[0]._id
            });
          }
        })
        .catch((err) => console.error("Error loading data:", err));
    }
  }, [isOpen, projectTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOffer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const total = Number(newOffer.finance) + Number(newOffer.duration) + Number(newOffer.guarantees);

    if (total !== 100) {
      toast({
        title: "يجب أن يكون مجموع النقاط 100!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return; // Empêche l'envoi si la somme n'est pas 100
    }

    try {
      const payload = {
        finance: newOffer.finance,
        duration: newOffer.duration,
        guarantees: newOffer.guarantees,
        projectName: projectTitle,
      };

      let url, method;
      if (newOffer._id) {
        url = `${API_URL}/${projectTitle}/evaluation/${newOffer._id}`;
        method = "PUT";
      } else {
        url = `${API_URL}/${projectTitle}/putevaluation`;
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({ title: "تم الحفظ!", status: "success", duration: 2000, isClosable: true });
        onClose();
      } else {
        const errorMsg = await response.text();
        toast({ title: "حدث خطأ أثناء الحفظ", status: "error", duration: 2000, isClosable: true });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <>
      <Button bgColor="#3e56dee7" _hover="none" mt={2} color="white" onClick={onOpen}>
        Critères d'évaluation
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent p={4} textAlign="center" fontFamily="Tajawal, sans-serif">
          <ModalHeader fontSize="2xl" fontWeight="bold">
            {projectTitle} : معايير تقييم العروض
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontWeight="bold" textAlign="right">نقطة أجل التسليم</FormLabel>
                <Input
                  name="finance"
                  border="1px solid gray"
                  placeholder="/100"
                  value={newOffer.finance}
                  onChange={handleChange}
                  textAlign="right"
                />
              </FormControl>


              <FormControl>
                <FormLabel fontWeight="bold" textAlign="right">مدة الضمان</FormLabel>
                <Input
                  border="1px solid gray"
                  name="duration"
                  placeholder="/100"
                  value={newOffer.duration}
                  onChange={handleChange}
                  textAlign="right"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold" textAlign="right">نقطة العرض المالي</FormLabel>
                <Input
                  border="1px solid gray"
                  name="guarantees"
                  placeholder="/100"
                  value={newOffer.guarantees}
                  onChange={handleChange}
                  textAlign="right"
                />
              </FormControl>
            </VStack>
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
