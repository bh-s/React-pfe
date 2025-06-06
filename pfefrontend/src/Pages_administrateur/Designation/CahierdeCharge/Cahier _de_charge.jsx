import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { NavLink, useLocation } from "react-router-dom";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { Box, useColorModeValue, Flex } from "@chakra-ui/react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import Sidebar from "../../../components/Sidebar/sidebar";
import "./Cahier_de_charge.css";
import { useNavigate } from "react-router-dom";
import Vazirmatn from "../../Blog_bugetaire/Vazirmatn-Regular.ttf";
import { format } from "date-fns";
import logo from "../../../Assets/Logo-UHBC-GO-final.jpg";
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import p2 from "../../../Assets/p2.png";
import p3 from "../../../Assets/p3.png";
import p4 from "../../../Assets/p4.png";
import p5 from "../../../Assets/p5.png";
import p6 from "../../../Assets/p6.png";
import p7 from "../../../Assets/p7.png";
import p8 from "../../../Assets/pp.png";
import pp from "../../../Assets/pp.png";
import p9 from "../../../Assets/p9.png";
import p10 from "../../../Assets/p10.png";
import Popup from "./Popup";

Font.register({
  family: "Vazirmatn",
  fonts: [{ src: Vazirmatn, fontWeight: "bold" }],
});
const currentDate = format(new Date(), "dd/MM/yyyy");
const annee = format(new Date(), "yyyy");
const Cahier_de_charge = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [numRation, setNumRation] = useState("");
  const [titreRation, settitreRation] = useState("");
  const [projectName, setProjectName] = useState("");
  const [showInputFields, setShowInputFields] = useState(false);
  const location = useLocation();
  const bg = useColorModeValue("white");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const handleShowInputFields = () => {
    setShowInputFields(true);
    setShowAdditionalFields(true);
  };
  const email = localStorage.getItem("email");
  const history = useNavigate();
  const [evaluationData, setEvaluationData] = useState(null);
  const handleRemoveAdditionalFields = () => {
    setShowInputFields(false);
    setShowAdditionalFields(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    history("/");
  };
  const handleBack = () => {
    history("/besoins");
  };
  const [existingLots, setExistingLots] = useState([]);
  const [existingLotNumbers, setExistingLotNumbers] = useState([]);
  const [selectedLotFilter, setSelectedLotFilter] = useState("all");
  const [newLotName, setNewLotName] = useState("");
  const [isAddingNewLot, setIsAddingNewLot] = useState(false);
  const [isAddingNewLotNumber, setIsAddingNewLotNumber] = useState(false);
  const [newLotNumber, setNewLotNumber] = useState("");
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/${projectName}/getevaluation`
        );
        // Log the API response to inspect its structure
        console.log("API Response:", response.data);
        if (response.data && response.data.length > 0) {
          setEvaluationData(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching evaluation data:", error);
      }
    };

    fetchProducts();
    fetchEvaluationData();
  }, [projectName]);
  useEffect(() => {
    console.log("Evaluation Data State:", evaluationData);
  }, [evaluationData]);
  const fetchProducts = async () => {
    const projectNameFromQuery = new URLSearchParams(location.search).get(
      "project"
    );
    setProjectName(projectNameFromQuery);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/data?projectName=${projectNameFromQuery}`
      );
      setProducts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    // Get unique lots
    const uniqueLots = Array.from(new Set(products.map((p) => p.titre_ration)));
    setExistingLots(uniqueLots);
  }, [products]);
  useEffect(() => {
    // Get unique lot numbers
    const uniqueLotNumbers = Array.from(
      new Set(products.map((p) => p.num_ration))
    );
    setExistingLotNumbers(uniqueLotNumbers);
  }, [products]);
  const handleProductNameChange = (event, productId) => {
    const updatedProducts = products.map((product) => {
      if (product._id === productId) {
        autoSave(productId, { name: event.target.value });
        return { ...product, name: event.target.value };
      } else {
        return product;
      }
    });
    setProducts(updatedProducts);
  };

  const handleProductPriceChange = (event, productId) => {
    const updatedProducts = products.map((product) => {
      if (product._id === productId) {
        autoSave(productId, { price: event.target.value });
        return { ...product, price: event.target.value };
      } else {
        return product;
      }
    });
    setProducts(updatedProducts);
  };
  const handleNumRationChange = (event, productId) => {
    const updatedNumRation = products.map((product) => {
      if (product._id === productId) {
        autoSave(productId, { num_ration: event.target.value });
        return { ...product, num_ration: event.target.value };
      } else {
        return product;
      }
    });
    setProducts(updatedNumRation);
  };
  const handleTitreRationChange = (event, productId) => {
    const updatedTitreRation = products.map((product) => {
      if (product._id === productId) {
        autoSave(productId, { titre_ration: event.target.value });
        return { ...product, titre_ration: event.target.value };
      } else {
        return product;
      }
    });
    setProducts(updatedTitreRation);
  };

  const handleProductQuantityChange = (event, productId) => {
    const updatedProducts = products.map((product) => {
      if (product._id === productId) {
        autoSave(productId, { quantity: event.target.value });
        return { ...product, quantity: event.target.value };
      } else {
        return product;
      }
    });
    setProducts(updatedProducts);
  };

  const autoSave = async (productId, updatedFields) => {
    const productToUpdate = products.find(
      (product) => product._id === productId
    );
    try {
      if (productToUpdate) {
        const updatedProduct = { ...productToUpdate, ...updatedFields };
        await axios.put(
          `${import.meta.env.VITE_API_URL}/data/${productId}`,
          updatedProduct
        );
      } else {
        console.error("Product not found.");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleKeyDown = async (event, productId) => {
    if (event.key === "Enter") {
      await handleSaveProduct(productId);
    }
  };

  const handleSaveProduct = async (productId) => {
    const productToUpdate = products.find(
      (product) => product._id === productId
    );
    try {
      if (productToUpdate) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/data/${productId}`,
          productToUpdate
        );
      } else {
        console.error("Product not found.");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/data/${productId}`);
        const updatedProducts = products.filter(
          (product) => product._id !== productId
        );
        setProducts(updatedProducts);
        autoSave(productId);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleAddProduct = async () => {
    if (
      productName.trim() !== "" &&
      productPrice.trim() !== "" &&
      productQuantity.trim() !== ""
    ) {
      const lotName = isAddingNewLot ? newLotName : titreRation;
      const lotNumber = isAddingNewLotNumber ? newLotNumber : numRation;
      const newProduct = {
        projectName,
        name: productName,
        num_ration: lotNumber,
        titre_ration: lotName,
        price: parseFloat(productPrice),
        quantity: parseInt(productQuantity),
        Montnt: parseFloat(productPrice) * parseInt(productQuantity),
      };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/save`,
          newProduct
        );
        if (response.status === 201) {
          await fetchProducts();
          setProductName("");
          setProductPrice("");
          setProductQuantity("");
          setNumRation("");
          settitreRation("");
          setShowInputFields(false);
        }
      } catch (error) {
        console.error("Failed to add product:", error);
      }
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleModifyProduct = async (productId) => {
    if (window.confirm("Are you sure you want to modify this product?")) {
      try {
        const productToModify = products.find(
          (product) => product._id === productId
        );
        setProductName(productToModify.name);
        setProductPrice(productToModify.price);
        setProductQuantity(productToModify.quantity);
        setNumRation(productToModify.num_ration);
        settitreRation(productToModify.titre_ration);
        setShowInputFields(true);
        // Remove the old product
        await handleDeleteProduct(productId);
      } catch (error) {
        console.error("Failed to modify product:", error);
      }
    }
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    products.forEach((product) => {
      totalAmount += product.price * product.quantity;
    });
    return totalAmount;
  };
  const totalAmount = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  let currentDatee = new Date();

  currentDatee.setDate(currentDatee.getDate() + 7);

  let formattedDate =
    ("0" + currentDatee.getDate()).slice(-2) +
    "/" +
    ("0" + (currentDatee.getMonth() + 1)).slice(-2) +
    "/" +
    currentDatee.getFullYear();

  const Designation = ({ products }) => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                textAlign: "left",
                marginBottom: "5px",
                fontSize: "12px",
                color: "black",
              },
            ]}
          >
            Date: {currentDate}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontWeight: "600",
                fontFamily: "Vazirmatn",
                marginBottom: "20px",
                fontSize: "16px",
                color: "black",
                textAlign: "center",
              },
            ]}
          >
            الجمهورية الجزائرية الديموقراطية الشعبية
            {"\n"} وزارة التعليم العالي و البحث العلمي
            {"\n"} جامعة حسيبة بن بوعلي الشلف
            {"\n"} كلية العلوم الدقيقة و الاعلام الالي
            {"\n"} الأمانة العامة
          </Text>
          <Image src={logo} style={styles.image} />
          <Text
            style={[
              styles.title,
              {
                fontWeight: "900",
                fontFamily: "Vazirmatn",
                marginTop: "30px",
                backgroundColor: "#dddddd",
                marginBottom: "40px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>N° </Text>
              <Text style={styles.tableHeader}>LOT </Text>
              <Text style={styles.tableHeader}>N° DE LOT</Text>
              <Text style={styles.tableHeader}>DESIGNATION </Text>
              <Text style={styles.tableHeader}>QUANTITE </Text>
              <Text style={styles.tableHeader}>PRIX </Text>
              <Text style={styles.tableHeader}>MONTANT</Text>
            </View>
            {products.map((product, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{index + 1}</Text>
                <Text style={[styles.tableCell, { fontFamily: "Vazirmatn" }]}>
                  {product.titre_ration}
                </Text>
                <Text style={[styles.tableCell, { fontFamily: "Vazirmatn" }]}>
                  {product.num_ration}
                </Text>
                <Text style={[styles.tableCell, { fontFamily: "Vazirmatn" }]}>
                  {product.name}
                </Text>
                <Text style={[styles.tableCell, { fontFamily: "Vazirmatn" }]}>
                  {product.quantity}
                </Text>
                <Text style={[styles.tableCell, { fontFamily: "Vazirmatn" }]}>
                  {product.price}
                </Text>
                <Text style={[styles.tableCell, { fontFamily: "Vazirmatn" }]}>
                  {product.price * product.quantity}
                </Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text
                style={{
                  ...styles.tableCell,
                  flex: 6,
                  textAlign: "center",
                  paddingRight: 37,
                }}
              >
                Total:
              </Text>
              <Text style={styles.tableCell}>{totalAmount}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
  const CahierDeCharge = ({ products }) => (
    <Document>
      <Page style={[styles.page, { border: "2px", borderColor: "black" }]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontWeight: "600",
                fontFamily: "Vazirmatn",
                marginBottom: "20px",
                fontSize: "16px",
                color: "black",
                textAlign: "center",
              },
            ]}
          >
            الجمهورية الجزائرية الديموقراطية الشعبية
            {"\n"} وزارة التعليم العالي و البحث العلمي
            {"\n"} جامعة حسيبة بن بوعلي الشلف
            {"\n"} كلية العلوم الدقيقة و الاعلام الالي
            {"\n"} الأمانة العامة
          </Text>
          <Image src={logo} style={styles.image} />
          <Text
            style={[
              styles.title,
              {
                fontWeight: "900",
                fontFamily: "Vazirmatn",
                marginTop: "30px",
                backgroundColor: "#dddddd",
              },
            ]}
          >
            {projectName}
          </Text>
          {products.map((product, index) => (
            <View key={index}>
              {index === 0 ||
              product.titre_ration !== products[index - 1].titre_ration ? (
                <>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontWeight: "900",
                        fontFamily: "Vazirmatn",
                        textAlign: "right",
                        direction: "rtl",
                        color: "black",
                        fontSize: "20px",
                      },
                    ]}
                  >
                    رقم الحصة {product.num_ration} : {product.titre_ration}
                  </Text>{" "}
                </>
              ) : null}
            </View>
          ))}
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page, { border: "2px", borderColor: "black" }]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Text style={styles.titrearticle}> المادة 02 : كيفية الإبرام</Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            {"\n"} تم اعداد دفتر الشروط وفق الاجراء المكيف طبقا للاحكام الواردة
            ضمن المرسوم التنفيذي 15-247 المؤرخ قي 16 سبتمبر 2015 يتضمن تنظيم
            الصفقات العمومية و تفويضات المرفق العام{" "}
          </Text>
          <Text style={styles.titrearticle}> المادة 03 : شروط العرض</Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            لا يمكن لنفس الشخص أن يمثل أكثر من متعهد أو مرشح في نفس الاستشارة-
            {"\n"} بمكن للمتعهد ان يشارك لحصه او عده حصص للاستشاره الواحده-
            {"\n"}لا يقدم المتعهد سوى عرض واحد-
          </Text>
          <Text style={styles.titrearticle}> المادة 04 : عملة العرض</Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            كل الأسعار المذكورة ينبغي أن تكون إجباريا مقدرة بالدينار الجزائري
          </Text>
          <Text style={styles.titrearticle}>
            {" "}
            المادة 05 : شروط أهلية العارضين
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            {"\n"}ليكون المتعهد مؤهلا ينبغي له اجباريا ان يكون قادرا على ممارسة
            نشاط موضوع دفتر الشروط هذا,وان لا يكون ضمن المتعاملين الاقتصاديين
            الممنوعين من المشاركة في المناقصات و الاستشارات-
          </Text>
          <Text style={styles.titrearticle}>
            {" "}
            المادة 06 : حالة إقصاء المؤسسة
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            :بمقتضى المادة 75 من المرسوم التنفيذي 15-247 المؤرخ في 15 سبتمبر
            2015 والمتضمن تنظيم الصفقات العمومية وتفويضات المرفق العام يقصى،
            بشكل مؤقت أو نهائي، من المشاركة في الصفقات العمومية، المتعاملون
            الاقتصاديون
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            {"\n"} الذين رفضوا استكمال عروضهم أو تنازلوا عن تنفيذ الاتفاقية قبل
            نفاذ آجال صلاحية العروض، حسب الشروط المنصوص عليها في المادتين 71 و
            74 من هذا المرسوم-
            {"\n"} الذين هم في حالة الإفلاس أو التصفية أو التوقف عن النشاط أو
            التسوية القضائية أو الصلح-
            {"\n"} الذين هم محل إجراء عملية الإفلاس أو التصفية أو التوقف عن
            النشاط أو التسوية القضائية أو الصلح-
            {"\n"} الذين كانوا محل حكم قضائي حاز قوة الشيء المقضي فيه بسبب
            مخالفة تمس بنزاهتهم -{"\n"} الذين لا يستوفون واجباتهم الجبائية وشبه
            الجبائية-
            {"\n"} الذين لا يستوفون الإيداع القانوني لحسابات شركاتهم-
            {"\n"} الذين قاموا بتصريح كاذب-
            {"\n"} المسجلون في قائمة المؤسسات المخلة بالتزاماتها بعدما كانوا محل
            مقررات الفسخ تحت مسؤوليتهم، من أصحاب المشاريع-
          </Text>
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            {"\n"} الذين رفضوا استكمال عروضهم أو تنازلوا عن تنفيذ الاتفاقية قبل
            نفاذ آجال صلاحية العروض، حسب الشروط المنصوص عليها في المادتين 71 و
            74 من هذا المرسوم-
            {"\n"} المسجلون في قائمة المتعاملين الاقتصاديين الممنوعين من
            المشاركة في الصفقات العمومية، المنصوص عليها في المادة 89 من هذا
            المرسوم-
            {"\n"} المسجلون في البطاقية الوطنية لمرتكبي الغش ومرتكبي المخالفات
            الخطيرة للتشريع والتنظيم في مجال الجباية والجمارك والتجارة-
            {"\n"} الذين كانوا محل إدانة بسبب مخالفة خطيرة لتشريع العمل والضمان
            الاجتماعي-
            {"\n"} الذين أخلوا بالتزاماتهم المحددة في المادة 84 من هذا المرسوم-
          </Text>
          <Text style={styles.titrearticle}>
            {" "}
            :المادة 07: النفقات المترتبة عن الاستشارة{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            يتحمل المتعهد جميع النفقات المترتبة عن إعداد تقديم عرضه. لا يمكن
            تحميل المسؤولية للمتعاقد مهما كانت مجريات أو نتيجة هذه الاستشارة
          </Text>
          <Text style={styles.titrearticle}> المادة 08 : تقديم العرض </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            : جب أن تتضمن العروض{"\n"} عرض مالي-{"\n"} عرض تقني-{"\n"}ملف
            الترشح-{"\n"}{" "}
          </Text>
          <Text style={styles.titrearticle}>: أ- يحتوي ملف الترشح على</Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            .(E.U.R.L) نسخة من وثائق تأسيس الشركة، إذا كان العارض شخص معنوي:
            المؤسسة ذات الشخص الوحيد وذات المسؤولية المحدودة {"\n"} .(S.A.R.L)
            شركة ذات مسؤوليات محدودة {"\n"} .(S.N.C) شركة التضامن {"\n"}{" "}
            .(SPA)شركة ذات الأسهم{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            .الوثائق المتعلقة بمنح الصلاحية للأشخاص لإشراك المؤسسة
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            .كل وثيقة تسمح بتقديم قدرات المترشح أو المتعهدين{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            :تودع الوثائق المذكورة أعلاه في ظرف أول مختوم تكتب عليه العبارات
            التالية
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontWeight: "900",
                fontFamily: "Vazirmatn",
                marginTop: "5px",
                backgroundColor: "#dddddd",
                fontSize: "18px",
              },
            ]}
          >
            {projectName}
            {"\n"} لفائدة كلية العلوم الدقيقة و الإعلام الآلي {"\n"}جامعة حسيبة
            بن بوعلي بأولاد فارس{"\n"} " ملف الترشح"{" "}
          </Text>
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            {"\n"} مذكرة تقنية تبريرية * {"\n"}: ينبغي ان تتضمن المذكرة التقنية
            التبريرية باختصار العناصر الآتية
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"}. (الاسم، إسم الشركة...) لمحة عامة عن الشركة -{"\n"} . المخطط
            التقديري والإجراءات التي تتخذها المؤسسة لاحترام الآجال-
            {"\n"} . منهجية سير العمل -{"\n"} . الضمانات -{"\n"} .خدمة ما بعد
            البيع، الصيانة وقطع الغيار - .مزايا العرض، على شكل خاتمة عامة
            للمذكرة التقنية -
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontWeight: "900",
                fontFamily: "Vazirmatn",
                marginTop: "5px",
                backgroundColor: "#dddddd",
                fontSize: "18px",
              },
            ]}
          >
            {projectName}
            {"\n"} لفائدة كلية العلوم الدقيقة و الإعلام الآلي {"\n"}جامعة حسيبة
            بن بوعلي بأولاد فارس{"\n"} " الملف التقني "
          </Text>
          <Text style={styles.titrearticle}> ج-العرض المالي </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            .جدول الاسعار الوحدوية، مؤرخ ، ممضي و مختوم - {"\n"} كشف كمي و
            تقديري ، مؤرخ ،ممضي و مختوم -{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontWeight: "900",
                fontFamily: "Vazirmatn",
                marginTop: "5px",
                backgroundColor: "#dddddd",
                fontSize: "18px",
              },
            ]}
          >
            {projectName}
            {"\n"} لفائدة كلية العلوم الدقيقة و الإعلام الآلي {"\n"}جامعة حسيبة
            بن بوعلي بأولاد فارس{"\n"} " العرض المالي "{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            :تودع هذه الأظرفة داخل ظرف آخر مقفل بإحكام ، يحمل العبارة{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontWeight: "900",
                fontFamily: "Vazirmatn",
                marginTop: "5px",
                backgroundColor: "#dddddd",
                fontSize: "18px",
                color: "black",
              },
            ]}
          >
            {" "}
            لا يفتح الا من طرف لجنة فتح الأظرفة وتقييم العروض
          </Text>
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            {"\n"}لا ينبغي في أي حال من الأحوال أن يحتوي العرض على تعديلات،
            زيادة أو حذف
            {"\n"} أيام ابتداء من تاريخ إخطاره (05) ينبغي للحائز على الاستشارة
            في أجل أقصاه خمسة : وعلى أي حال قبل نشر إعلان المنح المؤقت
            للاستشارة، تقديم الوثائق التالية
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
                marginRight: "15px",
              },
            ]}
          >
            نسخة من السجل التجاري أو نسخة من البطاقة الـمهنية للحرفي *
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
                marginRight: "15px",
              },
            ]}
          >
            {" "}
            . الكشوف الجبائية وشبه الجبائية تجاه الهيئة المكلفة بالعطل المدفوعة
            الأجر والبطالة الناجمة عن الأحوال الجوية لقطاعات البناء والأشغال
            العمومية والري، سارية المفعول*{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
                marginRight: "15px",
              },
            ]}
          >
            {" "}
            . رقم التعريف الجبائي*{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
                marginRight: "15px",
              },
            ]}
          >
            الإيداع القانوني لحسابات الشركة*
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
                marginRight: "15px",
              },
            ]}
          >
            {" "}
            .صحيفة السوابق القضائية سارية المفعول*
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            :لا تقبل العروض التقنية في الحالات التالي
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            دفتر الشروط المقدم من طرف المصلحة المتعاقدة غير مملوءغير ممضي وغير
            مختوم{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            جدول الاسعار الوحدوي غير مماوء كليا بالارقام و الحروف غير ممضي و غير
            مختوم من طرف صاحب التعهد
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            .الكشف الكمي و التقديري غير مملوء غير ممضي و غير مختوم من طرف صاحب
            التعهد{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            . إذا لم يصرح المتعهد بآجال التسليم و مدة الضمان{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            إذا لم يحترم المتعهد شروط التقييم ومعاييره{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
                marginTop: "5px",
                marginRight: "20px",
              },
            ]}
          >
            {" "}
            إذا لم تقدم الوثائق المذكورة أعلاه في الآجال المطلوبة أو تبين بعد
            تقديمها أنها تتضمن معلومات غير مطابقة لتلك المذكورة في التصريح
            بالترشح، يرفض العرض المعني وتستأنف المصلحة المتعاقدة إجراء منح
            الاستشارة، وإذا اكتشفت المصلحة المتعاقدة، بعد إمضاء الاتفاقية ، أن
            المعلومات التي قدمها صاحب الاستشارة زائفة، فإنها تأمر بفسخ الاتفاقية
            تحت مسؤولية المتعامل المتعاقد دون سواه _
          </Text>
          <Text style={styles.titrearticle}> المادة 09: تقديم العرض</Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            : يتم سحب دفتر الشروط من {"\n"} جامعة حسيبة بن بوعلي اولاد فارس ، -
            الشلف - كلية العلوم الدقيقة و الإعلام الآلي ،الأمانة العامة ، .مكتب
            الصفقات ، الطابق الثالث {"\n"}
            ختم المتعهد على سجل السحب ضروري
          </Text>
          <Text style={styles.titrearticle}>
            {" "}
            المادة 10: تعديل وثائق دفتر الشروط
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            .يمكن للمصلحة المتعاقد في اي وقت قبل انتهاء اجل تحضير العروض تعديل
            او تتمة وثاىق الاستشارة بمبادرة منها او ردا على طلب توضيح من
            المؤسسات المهتمة
          </Text>
          <Text style={styles.titrearticle}> المادة 11: مدة تحضير العروض </Text>
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            .ويحدد أجل تحضير العروض بخمسة ايام ابتداءا من من تاريخ اول نشر
            لاعلان المنافسة,واذا تزامن اليوم الاخير مع يوم عطلة اويوم راحة
            قانونية يمدد التاريخ المحدد لتحضير العروض الى يوم العمل الموالي.
            يمكن المصلحة المتعاقدة أن تمدد الأجل المحدد لتحضير العروض، إذا اقتضت
            الظروف ذلك. وفي هذه الحالة، تعلم المتعهدين بذلك بكل الوسائل المتاحة{" "}
          </Text>
          <Text style={styles.titrearticle}>
            {" "}
            المادة 12: مدة صلاحية العروض{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            . تقدر مدة صلاحية العروض بثلاثة أشهر مضافة الى أجل تحضير العروض, ذا
            لم تتمكن المصلحة المتعاقدة من منح الاستشارة والتبليغ عن ذلك قبل
            انقضاء أجل صلاحية العروض يصبح بإمكانها تمديده بعد موافقة المتعهدين
            المعنيين {"\n"} وفي حالة المؤسسة الحائزة على الاستشارة، يمدد أجل
            صلاحية العروض بشهر اضافي تلقائيا
          </Text>
          <Text style={styles.titrearticle}>
            المادة 13 : تاريخ و مكان إيداع العروض{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            .(ختم المتعهد على سجل الإيداع ضروري) يتم إيداع العروض والعينات لدى
            المصلحة المتعاقدة الكائن مقرها بالعنوان المذكور أسفله{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "center",
                marginBottom: "1px",
                marginTop: "10px",
              },
            ]}
          >
            {"\n"} الأمانة العامة – مكتب الصفقات، الطابق الثالث
            {"\n"} كلية العلوم الدقيقة و الإعلام الآلي
            {"\n"} جامعة حسيبة بن بوعلي بأولاد فارس - الشلف
            {"\n"} بتاريخ {formattedDate} قبل العاشرة صباحا
          </Text>
          <Text style={styles.titrearticle}> المادة 14: فتح الأظرفة </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"} : تتولى لجنة فتح الأظرفة وتقييم العروض الخاصة بالكلية عملية
            فتح الأظرفة وتقوم بالمهام التالية
            {"\n"} تثبت صحة تسجيل العروض_
            {"\n"} تعد قائمة المرشحين أو المتعهدين حسب ترتيب تاريخ وصول أظرفة
            ملفات ترشحهم أو عروضهم مع توضيح محتوى ومبالغ المقترحات والتخفيضات
            المحتملة_
            {"\n"} تحرر المحضر أثناء انعقاد الجلسة الذي يوقعه جميع أعضاء اللجنة
            الحاضرين، والذي يجب أن يتضمن التحفظات المحتملة المقدمة من قبل
            أعضاءاللجنة_
            {"\n"} تقترح على المصلحة المتعاقدة، عند الاقتضاء، في المحضر، إعلان
            عدم جدوى الإجراء حسب الشروط المنصوص عليها في المادة 40 من المرسوم
            التنفيذي رقم 15/247_
            {"\n"} ندعو المرشحين عن الاقتضاء, كتابيا عن المصلحة المتعاقدةالى
            استكمال عروضهم التقنيةت تحت طائلة رفض عروضهم بالوثائق الناقصة أو غير
            الكاملة الـمطلوبة، باستثناء المذكرة التقنية التبريرية في أجل أقصاه
            خمسة ابتداءا من تاريخ فتح الاظرفة ومهما يكن الامر تستثنى من طلب
            الاستكمال الوثائق الصادرة عن المتعهد والمتعلقة بتقييم العروض
            {"\n"}توقع بالحروف الأولى على وثائق الأظر��ة المفتوحة التي لا تكون
            محل طلب استكمال_
          </Text>
          <Text style={styles.titrearticle}> المادة 15: تقييم العروض</Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"} : يتم تقييم العروض من طرف لجنة فتح الأظرفة وتقييم العروض حسب
            كل حصة وتقوم هذه اللجنة خلال جلسة تقييم العروض بالمهام الآتية
            {"\n"}إقصاء الترشيحات والعروض غير الـمطابقة لمحتوى دفتر الشروط
            المعد*
          </Text>
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"} تعمل على تحليل العروض الباقية على أساس المعايير والمنهجية
            المنصوص عليها في دفتر الشروط*
            {"\n"}تحرر المحضر أثناء انعقاد الجلسة الذي يوقع عليه جميع أعضاء
            اللجنة الحاضرين، والذي يجب أن يتضمن التحفظات المحتملة المقدمة من قبل
            أعضاء اللجنة*
            {"\n"}تقوم، طبقا لدفتر الشروط، بانتقاء أحسن عرض من حيث الـمزايا
            الاقتصادية و الذي تحصل على أعلى نقطة استنادا إلى ترجيح عدة معايير من
            بينها معيار السعر
          </Text>
          <Text style={styles.titrearticle}> : معايير تقييم العروض </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            : بالنسبة للحصة رقم 02 سيتم التقييم على أساس المعايير التالية
          </Text>

          {/* Section 1: أجل التسليم */}
          <Text style={styles.titrearticle}>: أجل التسليم*</Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            : يجب على المتعهدين تحديد الآجال التي ينوون خلالها تسليم الإقتناءات،
            يستفيد المتعهد الذي يقترح أقصر أجل من 05 نقاط. أما المتعهدون الآخرون
            فسيتم تنقيطهم عن طريق تطبيق الصيغة التالية
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            النقطة = (أقصر أجل / الأجل المقدر) x 05
          </Text>
          {evaluationData && (
            <Text
              style={[
                styles.title,
                {
                  fontFamily: "Vazirmatn",
                  fontSize: "13px",
                  color: "black",
                  textAlign: "right",
                  marginBottom: "1px",
                },
              ]}
            >
              أجل التسليم: {evaluationData.finance || "غير متوفر"}
            </Text>
          )}

          {/* Section 2: مدة الضمان */}
          <Text style={styles.titrearticle}>: مدة الضمان *</Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            تقدر أدنى مدة للضمان باثني عشر ابتداء من تاريخ التسليم المؤقت.
            وسيمنح المتعهد 2 نقاط عن كل ثلاثة اشهر مقترحة تبعا لهذه الفترة مع 10
            نقاط كحد اقصى
          </Text>
          {evaluationData && (
            <Text
              style={[
                styles.title,
                {
                  fontFamily: "Vazirmatn",
                  fontSize: "13px",
                  color: "black",
                  textAlign: "right",
                  marginBottom: "1px",
                },
              ]}
            >
              مدة الضمان: {evaluationData.duration || "غير متوفر"}
            </Text>
          )}

          {/* Section 3: العرض المالي */}
          <Text style={styles.titrearticle}> : العرض المالي *</Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"}: يمنح العرض الاقل ثمنا 85 نقطةاما العروض الاخرى فستمنح لها
            تتناسب تناسبا عكسيا تحسب كالتالي
            {"\n"}النقطة = (العرض الأقل ثمنا/ العرض المالي المقدر) x (85)
            {"\n"}***أحسن عرض من حيث الـمزايا الاقتصادية يوافق للعرض الذي يتحصل
            على أعلى نقطة إجمالية ***
          </Text>
          {evaluationData && (
            <Text
              style={[
                styles.title,
                { fontFamily: "Vazirmatn", fontSize: "13px" },
              ]}
            >
              العرض المالي: {evaluationData.guarantees || "غير متوفر"}
            </Text>
          )}
          {/* {evaluationData && (
                    <>

                        <Text style={styles.title}>نقطة أجل التسليم: {evaluationData.finance}</Text>
                        <Text style={styles.title}>مدة الضمان: {evaluationData.duration}</Text>
                        <Text style={styles.title}>نقطة العرض المالي: {evaluationData.guarantees}</Text>
                    
                    </>
                )} */}
        </View>

        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Image src={p2} style={styles.imagep} />
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Image src={pp} style={styles.imagep} />
          <Text
            style={[
              styles.title,
              {
                fontWeight: "bold",
                fontFamily: "Vazirmatn",
                fontSize: "14px",
                color: "black",
                textAlign: "left",
                marginBottom: "1px",
                marginLeft: "50px",
              },
            ]}
          >
            الامضاء و الختم
          </Text>
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Text
            style={[
              styles.title,
              {
                fontWeight: "900",
                fontFamily: "Vazirmatn",
                marginTop: "50px",
                backgroundColor: "#dddddd",
              },
            ]}
          >
            دفتر التعليمات الخاصة
          </Text>
          <Text style={styles.titrearticle}>: المادة01: موضوع العقد </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            يتمثل موضوع العقد في {projectName}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {annee} لجامعة حسبية بن بوعلي الشلف للسنة المالية
          </Text>
          {products.map((product, index) => (
            <View key={index}>
              {index === 0 ||
              product.titre_ration !== products[index - 1].titre_ration ? (
                <>
                  <Text
                    style={[
                      {
                        fontWeight: "900",
                        fontFamily: "Vazirmatn",
                        textAlign: "center",
                        direction: "rtl",
                        color: "black",
                        fontSize: "20px",
                      },
                    ]}
                  >
                    رقم الحصة {product.num_ration} : {product.titre_ration}
                  </Text>
                </>
              ) : null}
            </View>
          ))}
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Image src={p3} style={styles.imagep} />
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Image src={p4} style={styles.imagep} />
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Image src={p5} style={styles.imagep} />
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Image src={p6} style={styles.imagep} />
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Image src={p7} style={styles.imagep} />
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Image src={p8} style={styles.imagep} />
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Image src={p9} style={styles.imagep} />
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Image
            src={p10}
            style={[styles.imagep, { height: "120", width: "280" }]}
          />
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Text
            style={[
              styles.title,
              {
                fontWeight: "900",
                fontFamily: "Vazirmatn",
                marginTop: "50px",
                backgroundColor: "#dddddd",
              },
            ]}
          >
            التفصيل الكمي والتقديري{" "}
          </Text>
          {products.map((product, index) => {
            const isFirstOccurrence =
              products.findIndex(
                (item, i) =>
                  i < index && item.titre_ration === product.titre_ration
              ) === -1;
            if (isFirstOccurrence) {
              return (
                <View key={index} style={styles.titleContainer}>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontWeight: "900",
                        fontFamily: "Vazirmatn",
                        textAlign: "center",
                        direction: "rtl",
                        color: "black",
                        fontSize: "20px",
                      },
                    ]}
                  >
                    رقم الحصة {product.num_ration} : {product.titre_ration}
                  </Text>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableHeader}>N°</Text>
                      <Text style={styles.tableHeader}>Designation</Text>
                      <Text style={styles.tableHeader}>Quantité</Text>
                      <Text style={styles.tableHeader}>PU HT</Text>
                      <Text style={styles.tableHeader}>Montant HT</Text>
                    </View>
                    {products.map((subProduct, subIndex) => {
                      if (subProduct.titre_ration === product.titre_ration) {
                        return (
                          <View key={subIndex} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{subIndex + 1}</Text>
                            <Text
                              style={[
                                styles.tableCell,
                                { fontFamily: "Vazirmatn" },
                              ]}
                            >
                              {subProduct.name}
                            </Text>
                            <Text
                              style={[
                                styles.tableCell,
                                { fontFamily: "Vazirmatn" },
                              ]}
                            >
                              {subProduct.quantity}
                            </Text>
                            <Text
                              style={[
                                styles.tableCell,
                                { fontFamily: "Vazirmatn" },
                              ]}
                            ></Text>
                            <Text
                              style={[
                                styles.tableCell,
                                { fontFamily: "Vazirmatn" },
                              ]}
                            ></Text>
                          </View>
                        );
                      } else {
                        return null;
                      }
                    })}
                    <View style={styles.table}>
                      <View style={styles.tableRow}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            flex: 4,
                            textAlign: "center",
                            paddingRight: 37,
                          }}
                        >
                          Montant DA (HT)
                        </Text>
                        <Text style={styles.tableCell}></Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            flex: 4,
                            textAlign: "center",
                            paddingRight: 37,
                          }}
                        >
                          T.V.A 19%
                        </Text>
                        <Text style={styles.tableCell}></Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            flex: 4,
                            textAlign: "center",
                            paddingRight: 37,
                          }}
                        >
                          Montant DA (TTC)
                        </Text>
                        <Text style={styles.tableCell}></Text>
                      </View>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: "Vazirmatn",
                      fontSize: "11px",
                      color: "black",
                      textAlign: "center",
                      marginBottom: "1px",
                    }}
                  >
                    {" "}
                    .................................................................................................
                    (بكل الرسوم) تم ايقاف هذا الكشف عند المبلغ{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Vazirmatn",
                      fontSize: "11px",
                      color: "black",
                      textAlign: "center",
                      marginBottom: "1px",
                    }}
                  >
                    {" "}
                    ..................................................................................................
                    اجل السليم{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Vazirmatn",
                      fontSize: "11px",
                      color: "black",
                      textAlign: "center",
                      marginBottom: "1px",
                    }}
                  >
                    {"\n"} ............................. حرر
                    ب.......................... يوم
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Vazirmatn",
                      fontSize: "11px",
                      color: "black",
                      textAlign: "center",
                      marginBottom: "1px",
                    }}
                  >
                    (مكتوبة بخ اليد)قرئ و قبل
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Vazirmatn",
                      fontSize: "11px",
                      color: "black",
                      textAlign: "center",
                      marginBottom: "1px",
                    }}
                  >
                    (الامضاء و الختم) المتعهد
                  </Text>
                </View>
              );
            } else {
              return null;
            }
          })}
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {" "}
            الامانة العامة - مكتب الصفقات - كلية العلوم الدقيقة و الاعلام الالي{" "}
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "11px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {projectName}
          </Text>
          <View style={styles.titleLine} />
          <Text
            style={[
              styles.title,
              {
                fontWeight: "900",
                fontFamily: "Vazirmatn",
                marginTop: "50px",
                backgroundColor: "#dddddd",
              },
            ]}
          >
            {" "}
            جدول الأسعار الوحدوي{" "}
          </Text>
          {products.map((product, index) => {
            const isFirstOccurrence =
              products.findIndex(
                (item, i) =>
                  i < index && item.titre_ration === product.titre_ration
              ) === -1;
            if (isFirstOccurrence) {
              return (
                <View key={index} style={styles.titleContainer}>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontWeight: "900",
                        fontFamily: "Vazirmatn",
                        textAlign: "center",
                        direction: "rtl",
                        color: "black",
                        fontSize: "20px",
                      },
                    ]}
                  >
                    رقم الحصة {product.num_ration} : {product.titre_ration}
                  </Text>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableHeader}>N°</Text>
                      <Text style={styles.tableHeader}>Designation</Text>
                      <Text style={styles.tableHeader}>PU HT</Text>
                      <Text style={styles.tableHeader}>Montant HT</Text>
                    </View>
                    {products.map((subProduct, subIndex) => {
                      if (subProduct.titre_ration === product.titre_ration) {
                        return (
                          <View key={subIndex} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{subIndex + 1}</Text>
                            <Text
                              style={[
                                styles.tableCell,
                                { fontFamily: "Vazirmatn" },
                              ]}
                            >
                              {subProduct.name}
                            </Text>
                            <Text
                              style={[
                                styles.tableCell,
                                { fontFamily: "Vazirmatn" },
                              ]}
                            ></Text>
                            <Text
                              style={[
                                styles.tableCell,
                                { fontFamily: "Vazirmatn" },
                              ]}
                            ></Text>
                          </View>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </View>
                  <Text
                    style={{
                      fontFamily: "Vazirmatn",
                      fontSize: "11px",
                      color: "black",
                      textAlign: "center",
                      marginBottom: "1px",
                    }}
                  >
                    {"\n"} ............................. حرر
                    ب.......................... يوم
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Vazirmatn",
                      fontSize: "11px",
                      color: "black",
                      textAlign: "center",
                      marginBottom: "1px",
                    }}
                  >
                    (مكتوبة بخ اليد)قرئ و قبل
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Vazirmatn",
                      fontSize: "11px",
                      color: "black",
                      textAlign: "center",
                      marginBottom: "1px",
                    }}
                  >
                    (الامضاء و الختم) المتعهد
                  </Text>
                </View>
              );
            } else {
              return null;
            }
          })}
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
    </Document>
  );

  const AppelOffre = ({ products }) => (
    <Document>
      <Page style={[styles.page, { border: "2px", borderColor: "black" }]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontWeight: "600",
                fontFamily: "Vazirmatn",
                marginBottom: "20px",
                fontSize: "16px",
                color: "black",
                textAlign: "center",
              },
            ]}
          >
            الجمهورية الجزائرية الديموقراطية الشعبية
            {"\n"} وزارة التعليم العالي و البحث العلمي
            {"\n"} جامعة حسيبة بن بوعلي الشلف
            {"\n"} كلية العلوم الدقيقة و الاعلام الالي
            {"\n"} الأمانة العامة
          </Text>
          <Image src={logo} style={styles.image} />
          <Text
            style={[
              styles.title,
              {
                fontWeight: "900",
                fontFamily: "Vazirmatn",
                marginTop: "30px",
                backgroundColor: "#dddddd",
              },
            ]}
          >
            {"\n"}اعلان عن {projectName}
            {"\n"} لفائدة جامعة حسيبة بن بوعلي الشلف
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"} الشاركة مفتوحة امام جميع المؤسسات المنفردة او في اطار تجمع مع
            احترام تنظيم الصفقات العمومية الساري المفعول
            {"\n"} يمكن للمتعهد المشاركة في حصة او اكثر, كما يمكن له ان يحوز على
            حصة واحدة او اكثر
            {"\n"} ........................... فعلى الراغبين في المشاركة سحب ملف
            الاستشارة و هذا ابتداءا من تاريخ
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "center",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"}المكتب رقم 96 الطابق الثالث
            {"\n"}الامانة العامة لجامعة حسيبة بن بةعلي الشلف
            {"\n"}اولاد فارس , الشلف
          </Text>
          <Text style={styles.titrearticle}> الوثائق المطلوبة في العروض </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            : يجب ان يتضمن العرض الوثائق المنصوص عليها في دفتر الشروط كالتالي
          </Text>
          <Text style={styles.titrearticle}> : ا_ملف الترشح </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"} .نسخة من القانون الاساسي بالنسبة للشركات او السجل التجاري
            بالنسبة للشخص الطبيعي-
            {"\n"} .الوثائق التي تتعلق بالتفويضات التي تسمح للاشخاص بالزام
            المؤسسة
          </Text>
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page, { border: "2px", borderColor: "black" }]}>
        <View style={styles.section}>
          <Text style={styles.titrearticle}>: ب_العرض التقني </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"} . مذكرة تقنية تبريرية _{"\n"} .دفتر الشروط يحتوي في اخر صفحته
            على عبارة "قرئ و قبل" مكتوبة بخط اليد _
          </Text>
          <Text style={styles.titrearticle}>: ج_العرض المالي </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"} .جدول الاسعار بالوحدة مملوء ممضي و مختوم_
            {"\n"} .التفصيل الكمي و التقديري مملوء ممضي و مختوم_
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            : يوضع ملف الترشح و العرض التقني و العرض المالي في اضرفة منفصلة و
            مقفلة باحكام تتضمن عبارة
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "center",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"} ملف الترشح" او "عرض تقني" او "عرض مالي" حسب الحالة"
            {"\n"} تسمية المؤسسة
            {"\n"}: استشارة عن طريق الاجراء المكيف
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                marginTop: "10px",
                backgroundColor: "#dddddd",
              },
            ]}
          >
            {"\n"}
            {projectName}
            {"\n"} لفائدة جامعة حسيبة بن بوعلي الشلف
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            : توضع الاضرفة الثلاثة في ضرف خارجي مجهول و مقفل باحكام بعبارة
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "center",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"} " لا يفتح الا من طرف لجنة فتح الاضرفة و تقييم العروض "{"\n"}:
            استشارة عن طريق الاجراء المكيف
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontWeight: "900",
                fontFamily: "Vazirmatn",
                marginTop: "10px",
                backgroundColor: "#dddddd",
              },
            ]}
          >
            {"\n"}
            {projectName}
            {"\n"} لفائدة جامعة حسيبة بن بوعلي الشلف
          </Text>
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
      <Page style={[styles.page, { border: "2px", borderColor: "black" }]}>
        <View style={styles.section}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"} يبقى المتعهدون ملزمين بعروضهم لمدة مساوي مدة تحضير العروض
            مضافا اليها ثلاثة 3 اشهر ابتداءا من تاريخ ايداع العروض
            {"\n"} مدة تحضير العرةض 8 ايام
            {"\n"} ...................... حدد تاريخ ايداع العروض في اخر يوم لمدة
            تحضير العروض قبل الساعة العشرة 10 صباحا و الذي يصادف تاريخ
            {"\n"}واذا صادف يوم عطلة يتم الفتح في اول يوم ليه من ايام العمل
            {"\n"} تكون جلسة فتح الاظرفة في نفس تاريخ ايداع العروض عل الساعة
            العاشرة 10 صباحا
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "right",
                marginBottom: "1px",
              },
            ]}
          >
            {"\n"}
            العارضون المشاركون مدعوون لحضور جلسة فتح الاظرفة المقرر اجراؤها
            بقاعة الاجتماعات للادارة العامة لجامعة الشلف
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Vazirmatn",
                fontSize: "13px",
                color: "black",
                textAlign: "left",
                marginBottom: "1px",
                marginLeft: "20px",
              },
            ]}
          >
            {"\n"}
            {"\n"} .......................... حرر بالشلف في
            {"\n"} مدير جامعة الشلف
          </Text>
        </View>
        <View style={styles.bottomLine} />
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </Page>
    </Document>
  );
  const styles = StyleSheet.create({
    titrearticle: {
      fontFamily: "Vazirmatn",
      textAlign: "right",
      fontSize: "23px",
      fontWeight: "bold",
      color: "black",
    },
    par: {
      fontFamily: "Vazirmatn",
      textAlign: "right",
      color: "black",
      fontSize: "18px",
    },
    productText: {
      fontFamily: "Vazirmatn",
      textAlign: "center",
    },
    evaluationSection: {
      marginTop: 20,
      padding: 10,
      backgroundColor: "#f9f9f9",
      border: "1px solid #ddd",
      borderRadius: 5,
    },
    title: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "right", // Align text to the right for RTL languages
    },
    titleLine: {
      height: 1,
      backgroundColor: "#17365D",
    },
    line: {
      position: "absolute",
      backgroundColor: "#17365D",
    },
    topLine: {
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      margin: "20px",
    },
    leftLine: {
      top: 0,
      bottom: 0,
      left: 0,
      width: 1,
      margin: "20px",
    },
    rightLine: {
      top: 0,
      bottom: 0,
      right: 0,
      width: 1,
      margin: "20px",
    },
    bottomLine: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: "#17365D",
      margin: "20px",
    },
    page: {
      flexDirection: "row",
      backgroundColor: "#ffffff",
      padding: 10,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {
      display: "table",
      width: "100%",
    },
    tableRow: {
      flexDirection: "row",
      width: "100%",
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: "#202124",
    },
    tableHeader: {
      backgroundColor: "#dddddd",
      fontSize: 12,
      textAlign: "center",
      borderRightWidth: 1,
      borderColor: "#202124",
      padding: 5,
      flex: 1,
    },
    tableCell: {
      fontSize: 10,
      textAlign: "center",
      padding: 5,
      borderRightWidth: 1,
      borderColor: "#202124",
      flex: 1,
    },
    image: {
      width: 100,
      height: 100,
      alignSelf: "center",
    },
    imagep: {
      marginTop: 20,
      width: 500,
      height: 600,
      alignSelf: "center",
    },
  });
  const calculateTextareaHeight = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  };
  const productNameRef = useRef(null);
  const productPriceRef = useRef(null);
  const productQuantityRef = useRef(null);
  const NumRationRef = useRef(null);
  const TitreRationRef = useRef(null);
  const filteredProducts = products.filter((product) => {
    if (selectedLotFilter === "all") return true;
    return product.titre_ration === selectedLotFilter;
  });
  return (
    <>
      <Sidebar />
      <main>
        <div>
          <div className="NavBar">
            <NavLink to="/besoins" className="Titles">
              Dashboard
            </NavLink>
            <div
              className="avatar"
              id="logoAvatar"
              style={{ display: "flex", position: "fixed" }}
            >
              <div style={{ marginRight: "20px", marginTop: "12px" }}>
                <select
                  style={{
                    padding: "5px",
                    fontSize: "15px",
                    borderRadius: "20px",
                  }}
                >
                  <option>Langue</option>
                  <option>Arabe</option>
                  <option>Français</option>
                </select>
              </div>
              <Menu>
                <MenuButton
                  as={Avatar}
                  style={{
                    height: "33px",
                    borderRadius: "90px",
                    cursor: "pointer",
                    marginRight: "-27px",
                    marginTop: "10px",
                    backgroundColor: "#11047A",
                  }}
                  src="https://bit.ly/broken-link"
                />
                <MenuList
                  style={{
                    borderRadius: "5px",
                    border: "none",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <MenuItem
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      mt: "5px",
                      padding: "15px",
                      paddingTop: "10px",
                      fontSize: "16px",
                    }}
                  >
                    {email}
                  </MenuItem>

                  <MenuItem
                    onClick={handleLogout}
                    style={{
                      color: "#F87272",
                      backgroundColor: "white",
                      border: "none",
                      padding: "10px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    <FaSignOutAlt style={{ marginRight: "5px" }} />
                    <span>Logout</span>
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
          <Flex display="flex" flexDirection="column" alignItems="flex-start">
            <h3
              id="subtitle"
              style={{
                color: "#364F6B",
                cursor: "pointer",
                width: "100%",
                marginLeft: "25px",
                marginBottom: "10px",
              }}
            >
              Dashboard
              <ArrowRightIcon
                style={{
                  fontSize: "10px",
                  marginLeft: "3px",
                  marginRight: "3px",
                }}
              />
              <span>{projectName}</span>
            </h3>
            <Flex
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              gap={4}
              className="buttonsposition"
              style={{ width: "100%", paddingLeft: "25px" }}
            >
              <button
                className="pdfButton"
                onClick={handleBack}
                style={{ backgroundColor: "#6B7280" }}
              >
                Back
              </button>
              <button className="pdfButton">
                <PDFDownloadLink
                  document={<AppelOffre products={products} />}
                  fileName="Appel d'offre"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? (
                      "Chargement.."
                    ) : (
                      <span style={{ color: "white" }}>Appel d'offre</span>
                    )
                  }
                </PDFDownloadLink>
              </button>
              <button className="pdfButton">
                <PDFDownloadLink
                  document={
                    <CahierDeCharge
                      products={products}
                      evaluationData={evaluationData}
                    />
                  }
                  fileName="Cahier de charge"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? (
                      "Chargement.."
                    ) : (
                      <span style={{ color: "white" }}>Cahier de charge</span>
                    )
                  }
                </PDFDownloadLink>
              </button>

              <Popup />
            </Flex>
          </Flex>
          <Box mx="auto" mt={2} ml={20}>
            <select
              value={selectedLotFilter}
              onChange={(e) => setSelectedLotFilter(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #cccccc",
                marginBottom: "10px",
                width: "200px",
              }}
            >
              <option value="all">All Lots</option>
              {existingLots.map((lot, index) => (
                <option key={index} value={lot}>
                  {lot}
                </option>
              ))}
            </select>
          </Box>
          <Box
            className="tables"
            mx="auto"
            mt={5}
            ml={20}
            bg={bg}
            overflowX="auto"
            border="2px solid #cccccc"
            padding="15px"
            borderRadius={10}
          >
            <table>
              <thead>
                <tr>
                  <th id="index">N°</th>
                  <th id="index">LOT</th>
                  <th id="index">N° DE LOT</th>
                  <th id="index">DESIGNATION</th>
                  <th id="index">QUANTITE</th>
                  <th id="index">PU HT</th>
                  <th id="index">MONTANT HT</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>
                      {" "}
                      <textarea
                        ref={TitreRationRef}
                        placeholder="LOT"
                        value={product.titre_ration}
                        onChange={(e) => {
                          settitreRation(e.target.value);
                          handleTitreRationChange(e, product._id);
                        }}
                        onBlur={() => autoSave(product._id)}
                        onKeyDown={(e) => handleKeyDown(e, product._id)}
                        style={{
                          width: "100%",
                          minHeight: "auto",
                          overflowY: "hidden",
                          border: "none",
                          resize: "none",
                          outline: "none",
                        }}
                      />
                    </td>
                    <td>
                      <select
                        value={isAddingNewLotNumber ? "new" : numRation}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "new") {
                            setIsAddingNewLotNumber(true);
                            setNumRation("");
                            setNewLotNumber("");
                          } else {
                            setIsAddingNewLotNumber(false);
                            setNumRation(value);
                          }
                        }}
                        style={{ width: "100%", padding: "5px" }}
                      >
                        <option value="">Select N° DE LOT</option>
                        {existingLotNumbers.map((num, index) => (
                          <option key={index} value={num}>
                            {num}
                          </option>
                        ))}
                        <option value="new">+ Add New N° DE LOT</option>
                      </select>
                      {isAddingNewLotNumber && (
                        <input
                          type="text"
                          placeholder="Enter new N° DE LOT"
                          value={newLotNumber}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNewLotNumber(value);
                            setNumRation(value);
                          }}
                          style={{ width: "100%", marginTop: "5px" }}
                        />
                      )}
                    </td>
                    <td>
                      <textarea
                        ref={productNameRef}
                        placeholder="Designation"
                        value={product.name}
                        onChange={(e) => {
                          setProductName(e.target.value);
                          calculateTextareaHeight(productNameRef);
                          handleProductNameChange(e, product._id);
                        }}
                        onBlur={() => autoSave(product._id)}
                        onKeyDown={(e) => handleKeyDown(e, product._id)}
                        style={{
                          width: "100%",
                          minHeight: "auto",
                          overflowY: "hidden",
                          border: "none",
                          resize: "none",
                          outline: "none",
                        }}
                      />
                    </td>
                    <td>
                      <textarea
                        ref={productQuantityRef}
                        placeholder="Quantité"
                        value={product.quantity}
                        onChange={(e) => {
                          setProductQuantity(e.target.value);
                          calculateTextareaHeight(productQuantityRef);
                          handleProductQuantityChange(e, product._id);
                        }}
                        onBlur={() => autoSave(product._id)}
                        onKeyDown={(e) => handleKeyDown(e, product._id)}
                        style={{
                          width: "100%",
                          minHeight: "auto",
                          overflowY: "hidden",
                          border: "none",
                          resize: "none",
                          outline: "none",
                        }}
                      />
                    </td>
                    <td>
                      <textarea
                        ref={productPriceRef}
                        placeholder="Prix"
                        value={product.price}
                        onChange={(e) => {
                          setProductPrice(e.target.value);
                          calculateTextareaHeight(productPriceRef);
                          handleProductPriceChange(e, product._id);
                        }}
                        onBlur={() => autoSave(product._id)}
                        onKeyDown={(e) => handleKeyDown(e, product._id)}
                        style={{
                          width: "100%",
                          minHeight: "auto",
                          overflowY: "hidden",
                          border: "none",
                          resize: "none",
                          outline: "none",
                        }}
                      />
                    </td>
                    <td>
                      <textarea
                        style={{
                          width: "100%",
                          minHeight: "auto",
                          overflowY: "hidden",
                          border: "none",
                          resize: "none",
                          outline: "none",
                        }}
                      >
                        {product.price * product.quantity}
                      </textarea>
                    </td>
                    <td style={{ display: "flex", gap: "10px" }}>
                      <button
                        style={{
                          color: "#4299E1",
                          fontSize: "1.2rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => handleModifyProduct(product._id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        style={{
                          color: "red",
                          fontSize: "1.2rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Total:
                </td>
                <td colSpan="2">{calculateTotalAmount()} (DA)</td>
              </tr>
            </table>

            {showInputFields ? (
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: "41.4px" }}>{products.length + 1}</td>
                    <td>
                      <select
                        value={isAddingNewLot ? "new" : titreRation}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "new") {
                            setIsAddingNewLot(true);
                            settitreRation("");
                            setNewLotName("");
                          } else {
                            setIsAddingNewLot(false);
                            settitreRation(value);
                          }
                        }}
                        style={{ width: "100%", padding: "5px" }}
                      >
                        <option value="">Select lot</option>
                        {existingLots.map((lot, index) => (
                          <option key={index} value={lot}>
                            {lot}
                          </option>
                        ))}
                        <option value="new">+ Add New Lot</option>
                      </select>
                      {isAddingNewLot && (
                        <input
                          type="text"
                          placeholder="Enter new lot name"
                          value={newLotName}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNewLotName(value);
                            settitreRation(value);
                          }}
                          style={{ width: "100%", marginTop: "5px" }}
                        />
                      )}
                    </td>
                    <td>
                      <select
                        value={isAddingNewLotNumber ? "new" : numRation}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "new") {
                            setIsAddingNewLotNumber(true);
                            setNumRation("");
                            setNewLotNumber("");
                          } else {
                            setIsAddingNewLotNumber(false);
                            setNumRation(value);
                          }
                        }}
                        style={{ width: "100%", padding: "5px" }}
                      >
                        <option value="">Select N° DE LOT</option>
                        {existingLotNumbers.map((num, index) => (
                          <option key={index} value={num}>
                            {num}
                          </option>
                        ))}
                        <option value="new">+ Add New N° DE LOT</option>
                      </select>
                      {isAddingNewLotNumber && (
                        <input
                          type="text"
                          placeholder="Enter new N° DE LOT"
                          value={newLotNumber}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNewLotNumber(value);
                            setNumRation(value);
                          }}
                          style={{ width: "100%", marginTop: "5px" }}
                        />
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Designation"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Quantité"
                        value={productQuantity}
                        onChange={(e) => setProductQuantity(e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="PU HT"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Montant"
                        value={productPrice * productQuantity}
                        readOnly
                        style={{ width: "104px" }}
                      />
                    </td>
                    <td
                      style={{
                        padding: "6.2px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <button className="pdfButton" onClick={handleAddProduct}>
                        Enregister
                      </button>
                      <span
                        onClick={handleRemoveAdditionalFields}
                        style={{
                          color: "red",
                          fontSize: "1.2em",
                          marginLeft: "3px",
                          marginBottom: "-7px",
                          cursor: "pointer",
                        }}
                      >
                        <FaTrashAlt />
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <button className="pdfButton" onClick={handleShowInputFields}>
                AJOUTER
              </button>
            )}
          </Box>
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <button className="pdfButton">
              <PDFDownloadLink
                document={<Designation products={products} />}
                fileName="Impression"
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    "Chargement.."
                  ) : (
                    <span style={{ color: "white" }}>Impression</span>
                  )
                }
              </PDFDownloadLink>
            </button>
          </Box>
        </div>
      </main>
    </>
  );
};

export default Cahier_de_charge;
