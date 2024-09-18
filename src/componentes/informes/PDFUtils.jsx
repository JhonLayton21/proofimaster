// pdfUtils.js

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Definir generatePDFBase
export const generatePDFBase = (doc, title, creationDate) => {
    doc.setFillColor(255, 165, 0);
    doc.rect(10, 10, 50, 10, 'F');
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text("PROOFIMASTER", 15, 17);

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(title, 80, 30);

    doc.setFillColor(255, 165, 0);
    doc.rect(10, 35, 50, 10, 'F');
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text("Fecha creación", 15, 42);
    doc.text(creationDate, 15, 48);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("proofisillas ltda.", 150, 42);
    doc.text("NIT: 1234567890", 150, 48);
};

// Definir generateTable
export const generateTable = (doc, head, body) => {
    autoTable(doc, {
        startY: 60,
        head: [head],
        body: body,
        headStyles: {
            fillColor: [255, 165, 0],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
        },
        bodyStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        },
    });
};

// Definir addFooter
export const addFooter = (doc) => {
    doc.setTextColor(255, 165, 0);
    doc.setFontSize(10);
    doc.text("Gracias por usar Proofimaster", 10, doc.internal.pageSize.height - 10);
};
