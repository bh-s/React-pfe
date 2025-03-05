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
  Button
} from "@chakra-ui/react";
import { useState } from "react";

export default function Popup() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newOffer, setNewOffer] = useState({
    company: "",
    price: "",
    duration: "",
    guarantees: "",
    technicalEvaluation: "",
    financialEvaluation: "",
    finalScore: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOffer((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <button className="pdfButton" onClick={onOpen}>
        open
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>إدخال تفاصيل العرض</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              إغلاق
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
