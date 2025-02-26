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
  RadioGroup,
  Radio,
  FormHelperText,
  Button,
  HStack
} from "@chakra-ui/react";

export default function Popup() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <button className="pdfButton" onClick={onOpen}>
        open
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
            <FormLabel as='legend'>Favorite Naruto Character</FormLabel>
            <RadioGroup defaultValue='Itachi'>
    <HStack spacing='24px'>
      <Radio value='Quantite'>wwwwwwwwww</Radio>
      <Radio value='Garentie'>aaaaaaaaa</Radio>
      <Radio value='ddddddd'>ddddddddddd</Radio>
      <Radio value='Sage of the six Paths'>Sage of the six Paths</Radio>
    </HStack>
  </RadioGroup>
              <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
