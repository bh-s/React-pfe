import React, { useEffect, useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

const Section2 = () => {
  const toast = useToast();
  const { projectName: routeProjectName } = useParams();
  const [projectName, setProjectName] = useState(routeProjectName || "");
  const [suppliers, setSuppliers] = useState([]);
  const [newOffer, setNewOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const evalRes = await axios.get(`${baseUrl}/dataEvaluation?projectName=${projectName}`);
        const offerRes = await axios.get(`${baseUrl}/${projectName}/getevaluation`);

        const evalData = Array.isArray(evalRes.data) ? evalRes.data[0] : evalRes.data;
        const offer = Array.isArray(offerRes.data) ? offerRes.data[0] : offerRes.data;

        const formattedSuppliers = (evalData?.suppliers || []).map((s) => ({
          name: s.name || "",
          reference: s.reference || "",
          note: s.note || "",
          point_duree_execution: s.point_duree_execution || "0",
          point_duree_garantie: s.point_duree_garantie || "0",
          point_offre_financiere: s.point_offre_financiere || "0",
          ordre: s.ordre || "",
          duree_execution: s.duree_execution || "",
          duree_garantie: s.duree_garantie || "",
        }));

        setSuppliers(formattedSuppliers);
        setNewOffer({
          finance: offer.finance,
          duration: offer.duration,
          guarantees: offer.guarantees,
        });

        setLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Échec de chargement des données",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    };

    if (projectName) fetchAll();
  }, [projectName]);

  const generateInitialContent = () => {
    let html = `
      <h2 style="text-align:right"><strong>1. التعريف بالمتعاملين الاقتصاديين الذين تمت استشارتهم:</strong></h2>
      <table>
        <thead>
          <tr>
            <th>اسم العارض</th>
            <th>مرجع و تاريخ رسالة الاستشارة</th>
            <th>الملاحظات</th>
          </tr>
        </thead>
        <tbody>
          ${suppliers
            .map(
              (s) => `
            <tr>
              <td>${s.name}</td>
              <td>${s.reference}</td>
              <td>${s.note}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

   html += `
  <h2 style="text-align:right"><strong>2. تقديم العروض المقدمة من طرف المتعاملين الاقتصاديين:</strong></h2>
  <table>
    <thead>
      <tr>
        <th>اسم العارض</th>
        <th>نقاط التنفيذ</th>
        <th>نقاط التمويل</th>
         <th>نقاط الضمان</th>
        <th>مدة التنفيذ</th>
        <th>مدة الضمان</th>
        <th>المجموع</th>
        <th>الترتيب</th>
      </tr>
    </thead>
    <tbody>
      ${suppliers
        .map((s) => {
          const total =
            parseFloat(s.point_duree_execution) +
            parseFloat(s.point_duree_garantie) +
            parseFloat(s.point_offre_financiere);
          return `
          <tr>
            <td>${s.name}</td>
            <td>${s.point_duree_execution}</td>
            <td>${s.point_duree_garantie}</td>
            <td>${s.point_offre_financiere}</td>
            <td>${s.duree_execution}</td>
            <td>${s.duree_garantie}</td>
            <td><strong>${total.toFixed(2)}</strong></td>
            <td>${s.ordre}</td>
          </tr>
        `;
        })
        .join("")}
    </tbody>
  </table>
`;

    return html;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link,
      ImageExtension,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      localStorage.setItem("rapport", editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && !loading) {
      editor.commands.setContent(generateInitialContent());
    }
  }, [editor, suppliers, newOffer]);

  if (loading) return <Box p={8}>جاري التحميل...</Box>;

  return (
    <Box p={4} bg="white" borderRadius="lg" boxShadow="md">
      <Box
        p={6}
        minH="600px"
        dir="rtl"
        sx={{
          ".ProseMirror": {
            direction: "rtl",
            textAlign: "right",
            fontFamily: "Cairo, sans-serif",
            fontSize: "1.25em",
            lineHeight: "2",
            table: {
              borderCollapse: "collapse",
              width: "100%",
              marginTop: "1rem",
              "th, td": {
                border: "1px solid #999",
                padding: "0.5rem",
              },
              th: { backgroundColor: "#f0f0f0" },
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default Section2;
