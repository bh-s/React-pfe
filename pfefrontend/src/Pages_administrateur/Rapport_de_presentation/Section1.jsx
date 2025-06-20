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
        CONSULTATION_REF: (projectName) => `استشـــارة رقم المتعلقة ب ${projectName}`,
        SECTION_1: "1. تعليل الإجراء:",
        SECTION_2: "2. معلومات حول إجراء الاستشارة:",
        SECTION_3: "3. الأهلية:",
    },
    CONTENT: {
        SECTION_1: `تمت الاستشارة وفقا لأحكام المرسوم الرئاسي 15-247 المؤرخ في 16 سبتمبر 2015 المتضمن تنظيم الصفقات العمومية وتفويضات المرفق العام لا سيما المواد 13 إلى 22 منه و القانون رقم 23-12 المؤرخ في 05 أوت 2023 المحدد للقواعد العامة المتعلقة بالصفقات العمومية.
• تطبيقا للمادة 87 من المرسوم الرئاسي 15-247 المؤرخ في 16 سبتمبر 2015 المتضمن تنظيم الصفقات العمومية وتفويضات المرفق العام فإنه لم تتم مشاركة المؤسسات المصغرة لعدم تلبية الحاجات`,
        SECTION_2: (dateCreation) => `
    إعلان عن الاستشارة بتاريخ ${dateCreation} بالإضافة إلى رسالة الاستشارة: رقم 24،25،27،28،29،30 و 32 بتاريخ ${dateCreation} المبلغة إلى المتعاملين الاقتصاديين كتابياً عن طريق الفاكس أو عن طريق الاستلام اليدوي، مع الاعلان في الموقع الالكتروني للكلية و الموقع الالكتروني للجامعة و اشهار الاعلان على مستوى غرفة التجارة ، الوكالة الوطنية لدعم تشغيل الشباب (ANSEJ) ،الوكالة الوطنية لتسيير القرض المصغر (ANGEM) الصندوق الوطني للتأمين عن البطالة (CNEC).
`,

        SECTION_2_ADDITIONAL: (rowDate,montantParagraphs) => `- التقدير الإداري:  ${montantParagraphs} تم اعداد هذا التقدير وفقاً:
• مبلغ الميزانية.
• الأسعار المتداولة في السوق الوطني
- العارضون المشاركون مدعوون لحضور جلسة فتح الأظرفة المقرر إجراؤها بقاعة الاجتماعات بكلية العلوم الدقيقة و الإعلام الآلي 
بتاريخ: ${rowDate} على الساعة العاشرة (10) صباحاً.`,
        SECTION_3: `- المتعهد الحاصل على الاستشارة ليس في حالة إفلاس.
- المتعهد الحاصلين على الاستشارة في وضعية قانونية.
- المتعهد الحاصلون على الاستشارة يمارسون نفس النشاط موضوع الاستشارة و المبين في السجل التجاري لكل متعهد`
    },
    ANNOUNCE_TEMPLATE: (date, createdAt) => `
        حيث فتحت الأظرفـة في جلســة علنيــة بتاريخ ${new Date(date).toLocaleDateString('ar-EG')}
        و المعلــن عنهــا بتاريـــخ ${new Date(date).toLocaleDateString('ar-EG')}
        <br/>
        <span style="font-size: 16px; color: #555;">
            (تاريخ إنشاء الإعلان: ${new Date(createdAt)}
 
    }})
        </span>
    `
};

function Section1() {
    const { projectName: paramProjectName } = useParams();
    const [projectName, setProjectName] = useState(paramProjectName || "");
    const toast = useToast();
    const [rapportData, setRapportData] = useState([]);
    const [annonces, setAnnonces] = useState([]);
    const [filteredAnnonces, setFilteredAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
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
    }, []);
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
                console.log(annoncesResponse)

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
    }, [projectName, annonces]);

    const generateInitialContent = () => {
        const rationParagraphs = rapportData
            .filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.titre_ration === value.titre_ration && t.num_ration === value.num_ration
                ))
            )
            .map(item =>
                `<p style="font-size: 16px; text-align: right">
                ${item?.titre_ration ? `حصة ${item?.num_ration} ${item?.titre_ration || ''}` : ''}
            </p>`
            ).join('');

        const relevantAnnonce = annonces.find(item => item.titre === projectName);
        const createdAt = relevantAnnonce?.createdAt
            ? new Date(relevantAnnonce.createdAt).toLocaleDateString('ar-AL')
            : 'غير متوفرة';
        const rawDate = relevantAnnonce?.date
            ? new Date(relevantAnnonce.date).toLocaleDateString('ar-AL')
            : 'غير متوفرة';

        const creationParagraph = relevantAnnonce?.createdAt ? `
        <p style="font-size: 16px; text-align: right">
            ${new Date(relevantAnnonce.createdAt).toString()}
        </p>` : '';

        const dateParagraph = relevantAnnonce?.date ? `
        <p style="font-size: 16px; text-align: right" >
            ${new Date(relevantAnnonce.date).toDateString()}
        </p>` : '';
const montantParagraphs = Object.values(
    rapportData.reduce((acc, item) => {
        const key = `${item.num_ration}-${item.titre_ration}`;
        if (!acc[key]) {
            acc[key] = {
                num_ration: item.num_ration,
                titre_ration: item.titre_ration,
                totalMontant: 0
            };
        }
        acc[key].totalMontant += item.Montnt || 0;
        return acc;
    }, {})
).map((item) =>
   ` <p dir="rtl" style="font-size: 16px; text-align: right">
    • حصة رقم ${item.num_ration} - ${item.titre_ration} : ${item.totalMontant.toLocaleString('ar-DZ')} دج
</p>
`
).join('');

        return `
        <h1 style="text-align: center; font-size: 30px; font-family: 'Times New Roman'">
            ${STATIC_TEXTS.TITLES.MAIN_TITLE}
        </h1>
        <h1 style="text-align: center; font-size: 20px; font-family: 'Times New Roman'">
            ${STATIC_TEXTS.TITLES.PROJECT_TITLE(projectName)}
        </h1>
        <p style="text-align:right; font-size: 20px; font-family: 'Times New Roman'">
            ${STATIC_TEXTS.TITLES.CONSULTATION_REF(projectName)}
        </p>

        ${rationParagraphs}

        <h2 style="text-align: center; font-size: 30px; font-family: 'Times New Roman'">
            ${STATIC_TEXTS.TITLES.SECTION_1}
        </h2>
        <p style="text-align:right; font-size: 20px; font-family: 'Times New Roman'">
            ${STATIC_TEXTS.CONTENT.SECTION_1}
        </p>

        <h2 style="text-align: center; font-size: 30px; font-family: 'Times New Roman'">
            ${STATIC_TEXTS.TITLES.SECTION_2}
        </h2>
        <p style="text-align:right; font-size: 20px; font-family: 'Times New Roman'">
            إعلان عن الاستشارة بتاريخ ${createdAt} بالإضافة إلى رسالة الاستشارة: رقم 24،25،27،28،29،30 و 32 بتاريخ ${createdAt} المبلغة إلى المتعاملين الاقتصاديين كتابياً عن طريق الفاكس أو عن طريق الاستلام اليدوي، مع الاعلان في الموقع الالكتروني للكلية و الموقع الالكتروني للجامعة و اشهار الاعلان على مستوى غرفة التجارة ، الوكالة الوطنية لدعم تشغيل الشباب (ANSEJ) ،الوكالة الوطنية لتسيير القرض المصغر (ANGEM) الصندوق الوطني للتأمين عن البطالة (CNEC).
        </p>
        <p style="text-align:right; font-size: 20px; font-family: 'Times New Roman'">
    ${STATIC_TEXTS.CONTENT.SECTION_2_ADDITIONAL(rawDate, montantParagraphs)}
        </p>

        <h2 style="text-align: center; font-size: 30px; font-family: 'Times New Roman'">
            ${STATIC_TEXTS.TITLES.SECTION_3}
        </h2>
        <p style="text-align:right; font-size: 20px; font-family: 'Times New Roman'">
            ${STATIC_TEXTS.CONTENT.SECTION_3}
        </p>
    `;
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
        if (editor && rapportData.length > 0 && !loading) {
            editor.commands.setContent(generateInitialContent());
        }
    }, [rapportData, filteredAnnonces, loading]);

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

export default Section1 
