import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, useToast } from '@chakra-ui/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';

const STATIC_TEXTS = {
  TITLES: {
    MAIN_TITLE: "الإجراءات المكيفة",
    PROJECT_TITLE: (projectName) => projectName,
  },
};

function Section3() {
  const { projectName: paramProjectName } = useParams();
  const [projectName, setProjectName] = useState(paramProjectName || "");
  const toast = useToast();
  const [rapportData, setRapportData] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [newOffer, setNewOffer] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectNameFromQuery = new URLSearchParams(window.location.search).get("project");
        const currentProjectName = projectNameFromQuery || projectName;
        setProjectName(currentProjectName);

        const rapportResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/data?projectName=${currentProjectName}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setRapportData(rapportResponse.data || []);

        const annoncesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/getAnnonce`);
        setAnnonces(annoncesResponse.data || []);

        const filtered = annoncesResponse.data.filter(annonce =>
          annonce.titre && annonce.titre.includes(currentProjectName)
        );
        setFilteredAnnonces(filtered);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          title: "Erreur",
          description: "Échec de la récupération des données",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectName]);

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
          montant_ttc: s.montant_ttc || "",
          decision: s.decision || "",
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

  const enrichRapportWithSupplierName = () => {
    return rapportData.map(item => {
      const matchedSupplier = suppliers.find(s => s.reference === item.reference);
      return {
        ...item,
        supplierName: matchedSupplier?.name || item.name || '',
      };
    });
  };

  const generateInitialContent = () => {
    const enrichedRapport = enrichRapportWithSupplierName();
    const groupedByRation = enrichedRapport.reduce((acc, item) => {
      const key = item.num_ration;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    let html = `
    
    `;

    html += `
      <h1 style="text-align: center; font-size: 20px; font-family: 'Times New Roman'">
        ${STATIC_TEXTS.TITLES.PROJECT_TITLE(projectName)}
      </h1>
    `;

    Object.entries(groupedByRation).forEach(([numRation, items]) => {
      const rationTitle = items[0]?.titre_ration || '';

      html += `
        <p style="font-size: 16px; text-align: right">
          ${rationTitle ? `حصة ${numRation} ${rationTitle}` : ''}
        </p>
        <table style="border-collapse: collapse; width: 100%; margin: 1rem 0;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 0.5rem; background-color: #f7fafc;">المبلغ بكل الرسوم</th>
              <th style="border: 1px solid #000; padding: 0.5rem; background-color: #f7fafc;">قرار اللجنة</th>
              <th style="border: 1px solid #000; padding: 0.5rem; background-color: #f7fafc;">العارض</th>
            <th style="border: 1px solid #000; padding: 0.5rem; background-color: #f7fafc;">الترتيب</th>

            </tr>
          </thead>
          <tbody>
           ${suppliers
            .map(
              (s) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 0.5rem;">${s.montant_ttc || ''}</td>
                  <td style="border: 1px solid #000; padding: 0.5rem;">${s.decision || ''}</td>
                  <td style="border: 1px solid #000; padding: 0.5rem;">${s.name || ''}</td>
                  <td style="border: 1px solid #000; padding: 0.5rem;">${s.ordre || ''}</td>
                </tr>
              `
            )
            .join("")}
          </tbody>
        </table>
         <p>اقتراح اللجنة : بعد دراسة العروض المقدمة من طرف المتعاملين الاقتصاديين اقترحت اللجنة اسناد اللوازم للعارض قيداون عبد القادر باعتباره قدم أحسن عرض من حيث المزايا الاقتصادية و باعتباره العارض الوحيد بمبلغ</p>

      `;
    });

    return html;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      ImageExtension,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      localStorage.setItem('editorContent', editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && rapportData.length > 0 && suppliers.length > 0 && !loading) {
      editor.commands.setContent(generateInitialContent());
    }
  }, [editor, rapportData, filteredAnnonces, suppliers, loading]);

  if (loading) {
    return <Box p={6}>Chargement en cours...</Box>;
  }

  return (
    <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden">
      <Box
        p={6}
        minH="400px"
        className="editor"
        sx={{
          '.ProseMirror': {
            minH: '1000px',
            '&:focus': { outline: 'none' },
            'h1, h2, h3, h4, h5, h6': {
              margin: '1rem 0',
              fontSize: "2em",
              fontWeight: "bold",
              color: '#333',
            },
            p: {
              margin: '0.5rem 0',
              fontSize: "1.5em",
              lineHeight: '1.6',
              textAlign: 'right',
              fontFamily: 'Times New Roman'
            },
            'ul, ol': { paddingLeft: '1.5rem', margin: '0.5rem 0' },
            table: {
              borderCollapse: 'collapse',
              width: '100%',
              margin: '1rem 0',
              'th, td': { border: '1px solid #000', padding: '0.5rem' },
              th: { backgroundColor: '#f7fafc', fontWeight: 'bold' },
            },
          }
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}

export default Section3;
