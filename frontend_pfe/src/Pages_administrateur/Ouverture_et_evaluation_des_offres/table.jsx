"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
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
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Badge,
} from "@chakra-ui/react"
import axios from "axios"

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

  const initialColumns = 2 + initialGroupCount * 2
  const [tableData, setTableData] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(initialColumns).fill("")),
  )
  const [isSaving, setIsSaving] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  // Add a new state for projectName
  const [projectName, setProjectName] = useState(useParams().projectName || "")
  const location = window.location
  const [totals, setTotals] = useState(Array(initialGroupCount).fill("0.00"))
  const [newOffer, setNewOffer] = useState({
    finance: "",
    duration: "",
    guarantees: "",
  })

  // Calcul des points en temps réel
  const calculatedPoints = useMemo(() => {
    // Skip calculation if there are no suppliers or they don't have values
    if (suppliers.length === 0) return []

    // Find minimum execution time (lowest is best)
    const executionTimes = suppliers
      .map((s) => Number.parseFloat(s.duree_execution))
      .filter((time) => !isNaN(time) && time > 0)
    const minExecutionTime = executionTimes.length > 0 ? Math.min(...executionTimes) : 0

    // Find minimum financial offer (lowest is best)
    const financialOffers = totals.map((t) => Number.parseFloat(t)).filter((offer) => !isNaN(offer) && offer > 0)
    const minFinancialOffer = financialOffers.length > 0 ? Math.min(...financialOffers) : 0

    // Find maximum warranty period (highest is best)
    const warrantyPeriods = suppliers
      .map((s) => Number.parseFloat(s.duree_garantie))
      .filter((period) => !isNaN(period) && period > 0)
    const maxWarrantyPeriod = warrantyPeriods.length > 0 ? Math.max(...warrantyPeriods) : 0

    // Calculate points for each supplier
    return suppliers.map((supplier, index) => {
      // Execution time points (lower is better)
      let executionPoints = 0
      if (minExecutionTime > 0 && Number.parseFloat(supplier.duree_execution) > 0) {
        executionPoints =
          (minExecutionTime / Number.parseFloat(supplier.duree_execution)) * Number.parseFloat(newOffer.duration || "0")
      }

      // Financial offer points (lower is better)
      let financialPoints = 0
      if (minFinancialOffer > 0 && Number.parseFloat(totals[index]) > 0) {
        financialPoints =
          (minFinancialOffer / Number.parseFloat(totals[index])) * Number.parseFloat(newOffer.finance || "0")
      }

      // Warranty period points (higher is better)
      let warrantyPoints = 0
      if (maxWarrantyPeriod > 0 && Number.parseFloat(supplier.duree_garantie) > 0) {
        warrantyPoints =
          (Number.parseFloat(supplier.duree_garantie) / maxWarrantyPeriod) *
          Number.parseFloat(newOffer.guarantees || "0")
      }

      // Total points
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

  // Calcul du classement basé sur les points totaux
  const rankings = useMemo(() => {
    if (calculatedPoints.length === 0) return []

    // Trier les fournisseurs par points totaux (du plus grand au plus petit)
    const sortedSuppliers = [...calculatedPoints].sort((a, b) => b.totalPointsNumeric - a.totalPointsNumeric)

    // Attribuer les rangs (1 pour le meilleur score, 2 pour le deuxième, etc.)
    const rankings = Array(calculatedPoints.length).fill(0)

    sortedSuppliers.forEach((supplier, index) => {
      rankings[supplier.supplierIndex] = index + 1
    })

    return rankings
  }, [calculatedPoints])

  const addRow = () => {
    const newRow = Array(2 + groupCount * 2).fill("")
    setTableData([...tableData, newRow])
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
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dataEvaluation?projectName=${projectName}`)

      if (response.data) {
        if (Array.isArray(response.data)) {
          // If we got an array, take the first item
          if (response.data.length > 0) {
            setProducts(response.data[0].products || [])
            setProjectId(response.data[0]._id)

            // Update suppliers if they exist
            if (response.data[0].suppliers && response.data[0].suppliers.length > 0) {
              setSuppliers(response.data[0].suppliers)
              setGroupCount(response.data[0].suppliers.length)
            }
          }
        } else {
          // If we got a single object
          setProducts(response.data.products || [])
          setProjectId(response.data._id)

          // Update suppliers if they exist
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
          }
        })
        .catch((err) => console.error("Error loading data:", err))
    }
  }, [projectName])

  const fetchProductsFromData = async () => {
    const projectNameFromQuery = new URLSearchParams(location.search).get("project")
    setProjectName(projectNameFromQuery || projectName)

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/data?projectName=${projectNameFromQuery || projectName}`,
      )

      console.log("Raw API response:", response.data)

      if (response.data && Array.isArray(response.data)) {
        const newTableData = response.data.map((product) => {
          const row = Array(2 + groupCount * 2).fill("")

          row[0] = product.name || product.titre_ration || ""
          row[1] = product.quantity ? String(product.quantity) : ""

          if (product.price) {
            for (let i = 0; i < groupCount; i++) {
              row[2 + i * 2] = product.price ? String(product.price) : ""
              const quantity = Number.parseFloat(row[1]) || 0
              const price = Number.parseFloat(product.price) || 0
              row[3 + i * 2] = (quantity * price).toFixed(2)
            }
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

  const debugApiData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/data?projectName=${projectName}`)
      console.log("API Data Structure:", response.data)

      if (response.data && response.data.length > 0) {
        const firstItem = response.data[0]
        console.log("First item keys:", Object.keys(firstItem))
        console.log("First item values:", Object.values(firstItem))

        toast({
          title: "Debug Info",
          description: `First item keys: ${Object.keys(firstItem).join(", ")}`,
          status: "info",
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error("Debug error:", error)
    }
  }

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

      // Mettre à jour les points calculés et les classements avant de sauvegarder
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
          titre_ration: row[0],
          quantity: Number.parseFloat(row[1]) || 0,
          suppliers: Array.from({ length: groupCount }).map((_, index) => ({
            unitPrice: Number.parseFloat(row[2 + index * 2]) || 0,
            totalPrice: Number.parseFloat(row[3 + index * 2]) || 0,
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
      })
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (projectName) {
      fetchProducts()
      // Don't automatically fetch from /data endpoint to avoid overwriting data
    }
  }, [projectName])

  useEffect(() => {
    if (products && products.length > 0) {
      const newData = products.map((product) => {
        const row = Array(2 + groupCount * 2).fill("")
        row[0] = product.titre_ration || ""
        row[1] = product.quantity || ""

        // Fill in supplier data if available
        if (product.suppliers && product.suppliers.length > 0) {
          product.suppliers.forEach((supplier, index) => {
            if (index < groupCount) {
              row[2 + index * 2] = supplier.unitPrice || ""
              row[3 + index * 2] = supplier.totalPrice || ""
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

    if (colIndex === 1) {
      const globalQuantity = Number.parseFloat(value) || 0
      for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
        const unitPriceIndex = 2 + groupIndex * 2
        const totalPriceIndex = unitPriceIndex + 1
        const unitPrice = Number.parseFloat(newData[rowIndex][unitPriceIndex]) || 0
        newData[rowIndex][totalPriceIndex] = (globalQuantity * unitPrice).toFixed(2)
      }
    } else if (colIndex >= 2 && (colIndex - 2) % 2 === 0) {
      const globalQuantity = Number.parseFloat(newData[rowIndex][1]) || 0
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
          const totalPriceIndex = 2 + groupIndex * 2 + 1
          const cellValue = Number.parseFloat(row[totalPriceIndex]) || 0
          return acc + cellValue
        }, 0)
        .toFixed(2)
    })
    setTotals(newTotals)
  }, [tableData, groupCount])

  // Fonction pour obtenir la couleur du badge en fonction du classement
  const getRankColor = (rank) => {
    if (rank === 1) return "green"
    if (rank === 2) return "blue"
    if (rank === 3) return "yellow"
    return "gray"
  }

  return (
    <Box p={6}>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Duplicate Project
            </AlertDialogHeader>

            <AlertDialogBody>
              A project with this name already exists. Would you like to update the existing project?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  onClose()
                  fetchProducts() // Fetch the existing project data
                }}
                ml={3}
              >
                Yes, Update Existing
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <TableContainer border="1px" borderColor="gray.200" mb={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th rowSpan={2} textAlign="center">
                <Text mt={2} fontSize="lg" fontWeight="bold">اللوازم</Text>
              </Th>
              <Th rowSpan={2} textAlign="center">
                <Text mt={2} fontSize="lg" fontWeight="bold">الكمية</Text>
              </Th>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <Th key={groupIndex} colSpan={2} textAlign="center">
                  <Input
                    border="1px solid gray"
                    placeholder="Fournisseur"
                    mt={2}
                    value={suppliers[groupIndex].name}
                    onChange={(e) => handleSupplierChange(groupIndex, "name", e.target.value)}
                  />
                </Th>
              ))}
            </Tr>
            <Tr>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Th textAlign="center">
                    <Text fontSize="lg" fontWeight="bold">السعر الوحدوي</Text>
                  </Th>
                  <Th textAlign="center">
                    <Text fontSize="lg" fontWeight="bold">السعر الكلي</Text>
                  </Th>
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
                      onChange={(e) => handleInputChange(rowIndex, cellIndex, e.target.value)}
                      isReadOnly={cellIndex >= 2 && (cellIndex - 2) % 2 === 1}
                    />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Text fontSize="lg" fontWeight="bold">العرض المالي "المجموع"</Text>
                  </Td>
                  <Td textAlign="center">
                    <Text fontSize="lg" fontWeight="bold">{totals[groupIndex]}</Text>
                  </Td>
                </React.Fragment>
              ))}
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Flex flexDir="column">
                      <label style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>مدة الانجاز</label>
                      <Input
                        border="1px solid gray"
                        placeholder="مدة الانجاز"
                        textAlign="right"
                        value={suppliers[groupIndex].duree_execution}
                        onChange={(e) => handleSupplierChange(groupIndex, "duree_execution", e.target.value)}
                        fontSize="lg"
                        height="2.5rem"
                        bg="white"
                      />
                    </Flex>
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Flex flexDir="column">
                      <label style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>مدة الضمان</label>
                      <Input
                        border="1px solid gray"
                        placeholder="مدة الضمان"
                        textAlign="right"
                        value={suppliers[groupIndex].duree_garantie}
                        onChange={(e) => handleSupplierChange(groupIndex, "duree_garantie", e.target.value)}
                        fontSize="lg"
                        height="2.5rem"
                        bg="white"
                      />
                    </Flex>
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>

            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Flex flexDir="column">
                      <label style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>نقطة مدة الضمان</label>

                      <Input
                        border="1px solid gray"
                        placeholder="نقطة مدة الانجاز"
                        textAlign="right"
                        value={calculatedPoints[groupIndex]?.executionPoints || "0.00"}
                        readOnly
                        fontSize="lg"
                        height="2.5rem"
                        bg="gray.50"
                        fontWeight="bold"
                      />

                    </Flex>
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Flex flexDir="column">
                      <label style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>نقطة العرض المالي</label>

                      <Input
                        border="1px solid gray"
                        placeholder="نقطة مدة الضمان"
                        textAlign="right"
                        value={calculatedPoints[groupIndex]?.warrantyPoints || "0.00"}
                        readOnly
                        fontSize="lg"
                        height="2.5rem"
                        bg="gray.50"
                        fontWeight="bold"
                      />

                    </Flex>
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Flex flexDir="column">
                      <label style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>نقطة مدة الانجاز</label>

                      <Input
                        border="1px solid gray"
                        placeholder="نقطة العرض المالي"
                        textAlign="right"
                        value={calculatedPoints[groupIndex]?.financialPoints || "0.00"}
                        readOnly
                        fontSize="lg"
                        height="2.5rem"
                        bg="gray.50"
                        fontWeight="bold"
                      />

                    </Flex>
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Flex flexDir="column">
                      <label style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>النقطة النهائية</label>
                      <Input
                        placeholder="النقطة النهائية"
                        textAlign="right"
                        value={calculatedPoints[groupIndex]?.totalPoints || "0.00"}
                        readOnly
                      />
                    </Flex>
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              {Array.from({ length: groupCount }).map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Td textAlign="right">
                    <Flex flexDir="column">
                      <label style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>الترتيب</label>
                      <Flex alignItems="center">
                        <Input
                          placeholder="الترتيب"
                          textAlign="right"
                          value={rankings[groupIndex] || ""}
                          readOnly
                          mr={2}
                        />
                        {rankings[groupIndex] && (
                          <Badge
                            colorScheme={getRankColor(rankings[groupIndex])}
                            fontSize="1.4em"
                            p={3}
                            borderRadius="md"
                            boxShadow="sm"
                          >
                            {rankings[groupIndex]}
                          </Badge>
                        )}
                      </Flex>
                    </Flex>
                  </Td>
                  <Td></Td>
                </React.Fragment>
              ))}
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      <Box mt={4} display="flex" flexWrap="wrap" gap={2}>
        <Button onClick={addRow} colorScheme="teal" size="lg" fontWeight="bold">
          Ajouter Ligne
        </Button>
        <Button onClick={addGroup} colorScheme="blue" size="lg" fontWeight="bold">
          Ajouter Fournisseur
        </Button>
        <Button onClick={saveTableData} colorScheme="green" size="lg" fontWeight="bold" isLoading={isSaving} loadingText="Sauvegarde...">
          Sauvegarder
        </Button>
      </Box>
    </Box>
  )
}

export default DynamicTable
