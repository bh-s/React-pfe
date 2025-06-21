import { Box } from '@chakra-ui/react';
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

const staticFinalContent = `
  <p dir="rtl" style="font-size: 18px; text-align: right;">
    <strong> التفاوض مع المتعامل الاقتصادي أو المتعاملين الاقتصاديين الذين رست عليهم الاستشارة</strong><br/>
    لم يتم التفاوض.
  </p>

  <p dir="rtl" style="font-size: 18px; text-align: right;">
    <strong>8- معلومات مختلفة</strong><br/>
    الصيانة والخدمة ما بعد البيع<br/>
     التكوين.
  </p>

  <p dir="rtl" style="font-size: 18px; text-align: right;">
    <strong>:التمويل والقيد الميزانياتيI</strong><br/>
    <u>تحديد نوع النفقة</u> نفقات التسيير<br/>
     <u>تحديد المصدر ومرجع مقرر التمويل</u> كلية العلوم الدقيقة والإعلام الآلي للسنة المالية  (ميزانية الكلية)<br/><br/>

    <u>الحصة رقم 01:</u><br/>
     مبلغ الالتزام المطلوب بالأرقام: دج<br/>
     مبلغ الالتزام المطلوب بالأحرف<br/>
     التقييد الميزانياتي <br/><br/>

    <u>الحصة رقم 02:</u><br/>
     مبلغ الالتزام المطلوب بالأرقام: دج<br/>
     مبلغ الالتزام المطلوب بالأحرف<br/>
     التقييد الميزانياتي:
  </p>

  <p dir="rtl" style="font-size: 18px; text-align: right;">
    <strong>: العناصر المكونة لملف الالتزام من أجل تأشيرة المراقب الميزانياتيII</strong><br/>
     بطاقة الالتزام.<br/>
     سند الطلب أو العقد عند الاقتضاء.<br/>
     هذا التقرير التقديمي
  </p>

  <p dir="rtl" style="font-size: 18px; text-align: left; margin-top: 2rem;">
    حرر بأولاد فارس في <br/>
    عميد الكلية
  </p>
`;


function Section4() {
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
        content: staticFinalContent,
    });

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

export default Section4;
