import { Box, Text, Flex, Image, } from '@chakra-ui/react';
import logo from '../../Assets/Logo-UHBC-GO-final.jpg';

function Entete() {



    return (
        <><Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Flex justify="space-between" align="center">
                <Box textAlign="left" flex={1}>
                    <Text fontWeight="bold" fontSize="lg">République Algérienne Démocratique et Populaire</Text>
                    <Text>Ministère de l'Enseignement Supérieur</Text>
                    <Text>Université Hassiba Benbouali de Chlef</Text>
                </Box>

                <Box w="120px" mx={8}>
                    <Image
                        src={logo}
                        alt="UHBC Logo"
                        w="full"
                        h="auto"
                        objectFit="contain" />
                </Box>

                <Box textAlign="right" flex={1} dir="rtl">
                    <Text fontWeight="bold" fontSize="lg">الجمهورية الجزائرية الديموقراطية الشعبية</Text>
                    <Text>وزارة التعليم العالي و البحث العلمي</Text>
                    <Text>جامعة حسيبة بن بوعلي الشلف</Text>
                </Box>
            </Flex>

        </Box ></>

    )
}

export default Entete