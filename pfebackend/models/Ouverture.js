const mongoose = require('mongoose');

const ouvertureSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    candidateName: { type: String, required: true }, // المترشح
    assuranceCertificate: { type: String }, // شهادة التأمين
    workerCount: { type: Number }, // عدد العمال
    equipmentQuantity: { type: Number }, // كمية العتاد
    executionCertificate: { type: String }, // شهادة حسن التنفيذ
    financialFile: {
        unitPriceTable: { type: String }, // جدول الأسعار الوحدوي
        quantityEstimation: { type: String }, // الكشف الكمي والتقديري
        totalPriceWithTax: { type: Number }, // المبلغ بكل الرسوم
    },
    technicalFile: {
        technicalNote: { type: String }, // مذكرة تقنية
        specificationBook: { type: String }, // دفتر الشروط
    },
    submissionFile: {
        companyStatutes: { type: String }, // القانون الأساسي للشركة
        authorizationDocs: { type: String }, // وثائق التفويض
    },
}, { timestamps: true });

module.exports = mongoose.model('Ouverture', ouvertureSchema);
