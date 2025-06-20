import React, { useState, useEffect, useMemo, useRef } from "react"
import {
  Box,
  Button,
  Input,
  Flex,
  Text,
  useToast,
  useDisclosure,
  Badge,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Divider,
  SimpleGrid,
  Icon,
  VStack,
  useColorModeValue,
  Container,
  Progress,
} from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { FiPlus, FiSave, FiUsers, FiDollarSign, FiClock, FiShield, FiAward, FiTrendingUp } from "react-icons/fi"

const DynamicTable = () => {
  const toast = useToast()
  const initialGroupCount = 3
  const [groupCount, setGroupCount] = useState(initialGroupCount)
  const [products, setProducts] = useState([])
  const [projectId, setProjectId] = useState(null)
  const [suppliers, setSuppliers] = useState(
    Array(initialGroupCount).fill({
      name: "",
      point_duree_execution: "",
      point_duree_garantie: "",
      point_offre_financiere: "",
      ordre: "",
      duree_execution: "",
      duree_garantie: "",
    }),
  )

  const initialColumns = 4 + initialGroupCount * 2
  const [tableData, setTableData] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(initialColumns).fill("")),
  )
  const [isSaving, setIsSaving] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const [projectName, setProjectName] = useState(useParams().projectName || "")
  const location = window.location
  const [totals, setTotals] = useState(Array(initialGroupCount).fill("0.00"))
  const [totalsTVA, setTotalsTVA] = useState(Array(initialGroupCount).fill("0.00"))
  const [totalsTTC, setTotalsTTC] = useState(Array(initialGroupCount).fill("0.00"))
  const [newOffer, setNewOffer] = useState({
    finance: "",
    duration: "",
    guarantees: "",
  })

  const cardBg = useColorModeValue("white", "gray.700")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const headerBg = useColorModeValue("blue.50", "blue.900")
  const accentColor = useColorModeValue("blue.500", "blue.300")

  const calculatedPoints = useMemo(() => {
    if (suppliers.length === 0) return []

    const executionTimes = suppliers
      .map((s) => Number.parseFloat(s.duree_execution))
      .filter((time) => !isNaN(time) && time > 0)
    const minExecutionTime = executionTimes.length > 0 ? Math.min(...executionTimes) : 0

    const financialOffers = totals.map((t) => Number.parseFloat(t)).filter((offer) => !isNaN(offer) && offer > 0)
    const minFinancialOffer = financialOffers.length > 0 ? Math.min(...financialOffers) : 0

    const warrantyPeriods = suppliers
      .map((s) => Number.parseFloat(s.duree_garantie))
      .filter((period) => !isNaN(period) && period > 0)
    const maxWarrantyPeriod = warrantyPeriods.length > 0 ? Math.max(...warrantyPeriods) : 0

    return suppliers.map((supplier, index) => {
      let executionPoints = 0
      if (minExecutionTime > 0 && Number.parseFloat(supplier.duree_execution) > 0) {
        executionPoints =
          (minExecutionTime / Number.parseFloat(supplier.duree_execution)) * Number.parseFloat(newOffer.duration || "0")
      }

      let financialPoints = 0
      if (minFinancialOffer > 0 && Number.parseFloat(totals[index]) > 0) {
        financialPoints =
          (minFinancialOffer / Number.parseFloat(totals[index])) * Number.parseFloat(newOffer.finance || "0")
      }

      let warrantyPoints = 0
      if (maxWarrantyPeriod > 0 && Number.parseFloat(supplier.duree_garantie) > 0) {
        warrantyPoints =
          (Number.parseFloat(supplier.duree_garantie) / maxWarrantyPeriod) *
          Number.parseFloat(newOffer.guarantees || "0")
      }

      const totalPoints = executionPoints + financialPoints + warrantyPoints

      return {
        supplierIndex: index,
        name: supplier.name,
        executionPoints: executionPoints.toFixed(2),
        financialPoints: financialPoints.toFixed(2),
        warrantyPoints: warrantyPoints.toFixed(2),
        totalPoints: totalPoints.toFixed(2),
        totalPointsNumeric: totalPoints,
      }
    })
  }, [suppliers, totals, newOffer])

  const rankings = useMemo(() => {
    if (calculatedPoints.length === 0) return []

    const sortedSuppliers = [...calculatedPoints].sort((a, b) => b.totalPointsNumeric - a.totalPointsNumeric)

    const rankings = Array(calculatedPoints.length).fill(0)

    sortedSuppliers.forEach((supplier, index) => {
      rankings[supplier.supplierIndex] = index + 1
    })

    return rankings
  }, [calculatedPoints])

  const addRow = () => {
    const newRow = Array(4 + groupCount * 2).fill("")
    setTableData([...tableData, newRow])

    toast({
      title: "Row added",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    })
  }

  const addGroup = () => {
    setGroupCount((prev) => prev + 1)
    setTableData(tableData.map((row) => [...row, "", ""]))
    setSuppliers([
      ...suppliers,
      {
        name: "",
        point_duree_execution: "",
        point_duree_garantie: "",
        point_offre_financiere: "",
        ordre: "",
        duree_execution: "",
        duree_garantie: "",
      },
    ])

    toast({
      title: "Supplier added",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    })
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dataEvaluation?projectName=${projectName}`)
      if (response.data) {
        if (Array.isArray(response.data)) {
          if (response.data.length > 0) {
            setProducts(response.data[0].products || [])
            setProjectId(response.data[0]._id)
            console.log(response.data)
            if (response.data[0].suppliers && response.data[0].suppliers.length > 0) {
              setSuppliers(response.data[0].suppliers)
              setGroupCount(response.data[0].suppliers.length)
            }
          }
console.log('jjj'+ response)

        } else {
          setProducts(response.data.products || [])
          setProjectId(response.data._id)
          if (response.data.suppliers && response.data.suppliers.length > 0) {
            setSuppliers(response.data.suppliers)
            setGroupCount(response.data.suppliers.length)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    if (projectName) {
      fetch(`${import.meta.env.VITE_API_URL}/${projectName}/getevaluation`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setNewOffer({
              finance: data[0].finance,
              duration: data[0].duration,
              guarantees: data[0].guarantees,
              projectName: projectName,
              _id: data[0]._id,
            })
            console.log(data)
            console.log('jjj'+ data[0])

          }
        })
        .catch((err) => console.error("Error loading data:", err))
    }
  }, [projectName])

  useEffect(() => {
    const fetchData = async () => {
      const projectNameFromQuery = new URLSearchParams(location.search).get("project")
      setProjectName(projectNameFromQuery || projectName)

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/data?projectName=${projectNameFromQuery || projectName}`,
        )

        console.log("Raw API response:", response.data)

        if (response.data && Array.isArray(response.data)) {
          const newTableData = response.data.map((product) => {
            // Create a row with 4 base columns + supplier columns
            const row = Array(4 + groupCount * 2).fill("")

            row[0] = product.num_ration ? String(product.num_ration) : ""
            row[1] = product.titre_ration
            row[2] = product.name
            row[3] = product.quantity

            if (product.suppliers && product.suppliers.length > 0) {
              product.suppliers.forEach((supplier, index) => {
                if (index < groupCount) {
                  row[4 + index * 2] = supplier.unitPrice || ""
                  row[5 + index * 2] = supplier.totalPrice || ""
                }
              })
            }

            return row
          })

          setTableData(newTableData.length > 0 ? newTableData : tableData)
          console.log("Processed table data:", newTableData)
        } else {
          toast({
            title: "Info",
            description: "No products found or invalid data format",
            status: "info",
            duration: 3000,
            isClosable: true,
          })
        }
      } catch (error) {
        console.error("Error fetching products from /data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch products from data endpoint",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }

    fetchData()
  }, [])

  const validateData = (data) => {
    if (!data.projectName) {
      throw new Error("Project name is required")
    }

    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error("Products array cannot be empty")
    }

    if (!Array.isArray(data.suppliers) || data.suppliers.length === 0) {
      throw new Error("Suppliers array cannot be empty")
    }

    return true
  }

  const saveTableData = async () => {
    try {
      setIsSaving(true)

      const updatedSuppliers = suppliers.map((supplier, index) => {
        if (calculatedPoints[index]) {
          return {
            ...supplier,
            point_duree_execution: calculatedPoints[index].executionPoints,
            point_duree_garantie: calculatedPoints[index].warrantyPoints,
            point_offre_financiere: calculatedPoints[index].financialPoints,
            ordre: rankings[index].toString(),
          }
        }
        return supplier
      })

      const formattedData = {
        projectName: projectName || "default",
        products: tableData.map((row) => ({
          num_ration: Number.parseInt(row[0]) || 0,
          titre_ration: row[1] || "",
          name: row[2] || "",
          quantity: Number.parseFloat(row[3]) || 0,
          suppliers: Array.from({ length: groupCount }).map((_, index) => ({
            unitPrice: Number.parseFloat(row[4 + index * 2]) || 0,
            totalPrice: Number.parseFloat(row[5 + index * 2]) || 0,
          })),
        })),
        suppliers: updatedSuppliers.map((supplier) => ({
          name: supplier.name || "",
          point_duree_execution: supplier.point_duree_execution || "",
          point_duree_garantie: supplier.point_duree_garantie || "",
          point_offre_financiere: supplier.point_offre_financiere || "",
          ordre: supplier.ordre || "",
          duree_execution: supplier.duree_execution || "",
          duree_garantie: supplier.duree_garantie || "",
        })),
      }

      validateData(formattedData)

      console.log("Sending data:", JSON.stringify(formattedData, null, 2))

      let response

      if (projectId) {
        response = await axios.put(`${import.meta.env.VITE_API_URL}/dataEvaluation/${projectId}`, formattedData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/dataEvaluation`, formattedData, {
          headers: {
            "Content-Type": "application/json",
          },

        })


        if (response.data && response.data._id) {
          setProjectId(response.data._id)
        }

      }

      console.log("Server response:", response.data)

      toast({
        title: "Success",
        description: "Data saved successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      })
    } catch (error) {
      console.error("Error saving data:", error)
      let errorMessage = "Failed to save data"

      if (error.response) {
        console.error("Server error response:", error.response.data)

        if (error.response.data.code === 11000) {
          onOpen()
          return
        }

        errorMessage = error.response.data.message || error.response.data.error || errorMessage
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      })
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (projectName) {
      fetchProducts()
    }
  }, [projectName])

  useEffect(() => {
    if (products && products.length > 0) {
      const newData = products.map((product) => {
        const row = Array(4 + groupCount * 2).fill("")
        row[0] = product.num_ration
        row[1] = product.titre_ration
        row[2] = product.name
        row[3] = product.quantity

        if (product.suppliers && product.suppliers.length > 0) {
          product.suppliers.forEach((supplier, index) => {
            if (index < groupCount) {
              row[4 + index * 2] = supplier.unitPrice || ""
              row[5 + index * 2] = supplier.totalPrice || ""
            }
          })
        }

        return row
      })
      setTableData(newData)
    }
  }, [products, groupCount])

  const handleInputChange = (rowIndex, colIndex, value) => {
    const newData = [...tableData]
    newData[rowIndex][colIndex] = value

    if (colIndex === 3) {
      const globalQuantity = Number.parseFloat(value) || 0
      for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
        const unitPriceIndex = 4 + groupIndex * 2
        const totalPriceIndex = unitPriceIndex + 1
        const unitPrice = Number.parseFloat(newData[rowIndex][unitPriceIndex]) || 0
        newData[rowIndex][totalPriceIndex] = (globalQuantity * unitPrice).toFixed(2)
      }
    } else if (colIndex >= 4 && (colIndex - 4) % 2 === 0) {
      const globalQuantity = Number.parseFloat(newData[rowIndex][3]) || 0
      const unitPrice = Number.parseFloat(value) || 0
      const totalPriceIndex = colIndex + 1
      newData[rowIndex][totalPriceIndex] = (globalQuantity * unitPrice).toFixed(2)
    }
    setTableData(newData)
  }

  const handleSupplierChange = (supplierIndex, field, value) => {
    const newSuppliers = [...suppliers]
    newSuppliers[supplierIndex] = {
      ...newSuppliers[supplierIndex],
      [field]: value,
    }
    setSuppliers(newSuppliers)
  }

  useEffect(() => {
    const newTotals = Array.from({ length: groupCount }).map((_, groupIndex) => {
      return tableData
        .reduce((acc, row) => {
          const totalPriceIndex = 4 + groupIndex * 2 + 1
          const cellValue = Number.parseFloat(row[totalPriceIndex]) || 0
          return acc + cellValue
        }, 0)
        .toFixed(2)
    })
    setTotals(newTotals)

    const newTotalsTVA = newTotals.map((total) => {
      const totalValue = Number.parseFloat(total) || 0
      return (totalValue * 0.19).toFixed(2)
    })
    setTotalsTVA(newTotalsTVA)

    const newTotalsTTC = newTotals.map((total, index) => {
      const totalValue = Number.parseFloat(total) || 0
      const tvaValue = Number.parseFloat(newTotalsTVA[index]) || 0
      return (totalValue + tvaValue).toFixed(2)
    })
    setTotalsTTC(newTotalsTTC)
  }, [tableData, groupCount])

  const getRankColor = (rank) => {
    if (rank === 1) return "green"
    if (rank === 2) return "blue"
    if (rank === 3) return "yellow"
    return "gray"
  }

  const getProgressColor = (rank) => {
    if (rank === 1) return "green.400"
    if (rank === 2) return "blue.400"
    if (rank === 3) return "yellow.400"
    return "gray.400"
  }

  return (
    <Container maxW="container.xl" py={6}>

      <Card bg={cardBg} shadow="lg" borderRadius="lg" mb={8}>
        <CardHeader bg={headerBg} borderTopRadius="lg">
          <Heading size="md">Product Evaluation Table</Heading>
        </CardHeader>
        <CardBody overflowX="auto">
          <TableContainer>
            <Table variant="simple" colorScheme="blue" size="sm">
              <Thead bg={headerBg}>
                <Tr>
                  <Th rowSpan={2} textAlign="center">
                    <Text fontSize="md" fontWeight="bold">
                      رقم الحصة
                    </Text>
                  </Th>
                  <Th rowSpan={2} textAlign="center">
                    <Text fontSize="md" fontWeight="bold">
                      اسم الحصة
                    </Text>
                  </Th>
                  <Th rowSpan={2} textAlign="center">
                    <Text fontSize="md" fontWeight="bold">
                      اللوازم
                    </Text>
                  </Th>
                  <Th rowSpan={2} textAlign="center">
                    <Text fontSize="md" fontWeight="bold">
                      الكمية
                    </Text>
                  </Th>
                  {Array.from({ length: groupCount }).map((_, groupIndex) => (
                    <Th key={groupIndex} colSpan={2} textAlign="center">
                      <Input
                        placeholder="Fournisseur"
                        mt={2}
                        value={suppliers[groupIndex].name}
                        onChange={(e) => handleSupplierChange(groupIndex, "name", e.target.value)}
                        bg="white"
                        borderColor={borderColor}
                        _hover={{ borderColor: accentColor }}
                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      />
                    </Th>
                  ))}
                </Tr>
                <Tr>
                  {Array.from({ length: groupCount }).map((_, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                      <Th textAlign="center">
                        <Text fontSize="md" fontWeight="bold">
                          السعر الوحدوي
                        </Text>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md" fontWeight="bold">
                          السعر الكلي
                        </Text>
                      </Th>
                    </React.Fragment>
                  ))}
                </Tr>
              </Thead>

              <Tbody>
                {tableData.map((row, rowIndex) => (
                  <Tr key={rowIndex} _hover={{ bg: "gray.50" }}>
                    {row.map((cell, cellIndex) => (
                      <Td key={cellIndex}>
                        <Input
                          width="auto"
                          value={cell}
                          onChange={(e) => handleInputChange(rowIndex, cellIndex, e.target.value)}
                          borderColor={borderColor}
                          _hover={{ borderColor: accentColor }}
                          _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                          bg={cellIndex >= 2 && (cellIndex - 2) % 2 === 1 ? "gray.50" : "white"}
                        />
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
              <Tfoot bg="gray.50">
                <Tr>
                  <Td colSpan={4} textAlign="right">
                    <Text fontSize="md" fontWeight="bold">
                      Montant DA (HT)
                    </Text>
                  </Td>
                  {Array.from({ length: groupCount }).map((_, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                      <Td></Td>
                      <Td textAlign="center">
                        <Text fontSize="md" fontWeight="bold" color={accentColor}>
                          {totals[groupIndex]}
                        </Text>
                      </Td>
                    </React.Fragment>
                  ))}
                </Tr>
                <Tr>
                  <Td colSpan={4} textAlign="right">
                    <Text fontSize="md" fontWeight="bold">
                      T.V.A 19%
                    </Text>
                  </Td>
                  {Array.from({ length: groupCount }).map((_, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                      <Td></Td>
                      <Td textAlign="center">
                        <Text fontSize="md" fontWeight="bold" color="gray.600">
                          {totalsTVA[groupIndex]}
                        </Text>
                      </Td>
                    </React.Fragment>
                  ))}
                </Tr>
                <Tr>
                  <Td colSpan={4} textAlign="right">
                    <Text fontSize="md" fontWeight="bold">
                      Montant DA (TTC)
                    </Text>
                  </Td>
                  {Array.from({ length: groupCount }).map((_, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                      <Td></Td>
                      <Td textAlign="center">
                        <Text fontSize="md" fontWeight="bold" color="green.600">
                          {totalsTTC[groupIndex]}
                        </Text>
                      </Td>
                    </React.Fragment>
                  ))}
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>

      <Card bg={cardBg} shadow="lg" borderRadius="lg" mb={8}>
        <CardHeader bg={headerBg} borderTopRadius="lg">
          <Heading size="md">Informations fournisseur</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2, lg: groupCount }} spacing={6}>
            {Array.from({ length: groupCount }).map((_, groupIndex) => (
              <Card key={groupIndex} variant="outline">
                <CardHeader bg={headerBg} pb={2}>
                  <Heading textAlign={'center'} size="sm">{suppliers[groupIndex].name || `Fournisseur ${groupIndex + 1}`}</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box display={"flex"} flexDir={"column"} alignItems={"flex-end"}>
                      <Flex align="center" mb={1}>
                        <Text fontWeight="bold">مدة الانجاز</Text>
                        <Icon as={FiClock} ml={2} color="blue.500" />
                      </Flex>
                      <Input
                        placeholder="مدة الانجاز"
                        textAlign="right"
                        value={suppliers[groupIndex].duree_execution}
                        onChange={(e) => handleSupplierChange(groupIndex, "duree_execution", e.target.value)}
                        borderColor={borderColor}
                        _hover={{ borderColor: accentColor }}
                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      />
                    </Box>

                    <Box display={"flex"} flexDir={"column"} alignItems={"flex-end"}>
                      <Flex align="center" mb={1}>
                        <Text fontWeight="bold">مدة الضمان</Text>
                        <Icon as={FiShield} ml={2} color="green.500" />

                      </Flex>
                      <Input
                        placeholder="مدة الضمان"
                        textAlign="right"
                        value={suppliers[groupIndex].duree_garantie}
                        onChange={(e) => handleSupplierChange(groupIndex, "duree_garantie", e.target.value)}
                        borderColor={borderColor}
                        _hover={{ borderColor: accentColor }}
                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      />
                    </Box>

                    <Divider />

                    <Box display={"flex"} flexDir={"column"} alignItems={"flex-end"}>
                      <Flex align="center" mb={1}>
                        <Text fontWeight="bold">نقطة العرض المالي</Text>
                        <Icon as={FiDollarSign} ml={2} color="purple.500" />

                      </Flex>
                      <Input
                        placeholder="نقطة العرض المالي"
                        textAlign="right"
                        value={calculatedPoints[groupIndex]?.financialPoints || "0.00"}
                        readOnly
                        bg="gray.50"
                        fontWeight="bold"
                      />
                    </Box>

                    <Box display={"flex"} flexDir={"column"} alignItems={"flex-end"}>
                      <Flex align="center" mb={1}>
                        <Text fontWeight="bold">نقطة مدة الانجاز</Text>
                        <Icon as={FiClock} ml={2} color="orange.500" />

                      </Flex>
                      <Input
                        placeholder="نقطة مدة الانجاز"
                        textAlign="right"
                        value={calculatedPoints[groupIndex]?.executionPoints || "0.00"}
                        readOnly
                        bg="gray.50"
                        fontWeight="bold"
                      />
                    </Box>

                    <Box display={"flex"} flexDir={"column"} alignItems={"flex-end"}>
                      <Flex align="center" mb={1}>
                        <Text fontWeight="bold">نقطة مدة الضمان</Text>
                        <Icon as={FiShield} ml={2} color="teal.500" />

                      </Flex>
                      <Input
                        placeholder="نقطة مدة الضمان"
                        textAlign="right"
                        value={calculatedPoints[groupIndex]?.warrantyPoints || "0.00"}
                        readOnly
                        bg="gray.50"
                        fontWeight="bold"
                      />
                    </Box>

                    <Divider />

                    <Box display={"flex"} flexDir={"column"} alignItems={"flex-end"}>
                      <Flex mb={1}>
                        <Text fontWeight="bold" >النقطة النهائية</Text>
                        <Icon as={FiAward} ml={2} color="red.500" />

                      </Flex>
                      <Input
                        placeholder="النقطة النهائية"
                        textAlign="right"
                        value={calculatedPoints[groupIndex]?.totalPoints || "0.00"}
                        readOnly
                        bg="gray.50"
                        fontWeight="bold"
                        color={getProgressColor(rankings[groupIndex])}
                      />
                    </Box>

                    <Box display={"flex"} flexDir={"column"} alignItems={"flex-end"}>
                      <Flex align="center" mb={1}>
                        <Icon as={FiTrendingUp} mr={2} color="blue.500" />
                        <Text fontWeight="bold">الترتيب</Text>
                      </Flex>
                      <Flex>
                        <Input
                          placeholder="الترتيب"
                          textAlign="right"
                          value={rankings[groupIndex] || ""}
                          readOnly
                          mr={2}
                          bg="gray.50"
                        />
                        {rankings[groupIndex] && (
                          <Badge
                            colorScheme={getRankColor(rankings[groupIndex])}
                            fontSize="xl"
                            p={2}
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            minW="40px"
                          >
                            {rankings[groupIndex]}
                          </Badge>
                        )}
                      </Flex>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      <Flex mt={6} gap={4} justifyContent="center" flexWrap="wrap">
        <Button
          onClick={addRow}
          colorScheme="teal"
          size="lg"
          fontWeight="bold"
          leftIcon={<FiPlus />}
          shadow="md"
          _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
          transition="all 0.2s"
        >
          Ajouter une ligne
        </Button>
        <Button
          onClick={addGroup}
          colorScheme="blue"
          size="lg"
          fontWeight="bold"
          leftIcon={<FiUsers />}
          shadow="md"
          _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
          transition="all 0.2s"
        >
          Ajouter fournisseur
        </Button>
        <Button
          onClick={saveTableData}
          colorScheme="green"
          size="lg"
          fontWeight="bold"
          isLoading={isSaving}
          loadingText="Saving..."
          leftIcon={<FiSave />}
          shadow="md"
          _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
          transition="all 0.2s"
        >
          sauvgarder
        </Button>
      </Flex>
    </Container>
  )
}

export default DynamicTable
