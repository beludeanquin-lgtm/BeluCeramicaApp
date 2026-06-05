const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, WidthType, BorderStyle, ShadingType, HeadingLevel } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "D4A5A0" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "6B5B56" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "Be·Lu Cerámica Studio", bold: true, size: 36, color: "6B5B56" })]
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [new TextRun({ text: "App de Gestión - Documentación Completa", size: 24, italics: true, color: "A79B96" })]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Descripción")]
      }),

      new Paragraph({
        spacing: { after: 300 },
        children: [new TextRun("Plataforma web para gestionar clases, inscripciones, pagos y catálogo de piezas de cerámica.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Credenciales Admin")]
      }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 4680, type: WidthType.DXA },
                shading: { fill: "F5D5D0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "EMAIL", bold: true })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({
                borders,
                width: { size: 4680, type: WidthType.DXA },
                shading: { fill: "F5D5D0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "CONTRASEÑA", bold: true })], alignment: AlignmentType.CENTER })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 4680, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun("beludeanquin@gmail.com")] })]
              }),
              new TableCell({
                borders,
                width: { size: 4680, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun("admin123")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 4680, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun("lucrebayj@gmail.com")] })]
              }),
              new TableCell({
                borders,
                width: { size: 4680, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun("admin123")] })]
              })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { after: 300 }, children: [new TextRun("")] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Horarios")]
      }),

      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("• Jueves: 18:00 - 20:00")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("• Viernes: 10:00 - 12:00")]
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [new TextRun("• Viernes: 18:00 - 20:00")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Precios")]
      }),

      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("Taller Regular: $70.000/mes")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("Clase Suelta: $27.000")]
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [new TextRun("Seña: $10.000")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Cómo Iniciar")]
      }),

      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("1. Abre: C:\\Users\\I556043\\Desktop\\BeluCeramicaApp")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("2. Abre terminal (cmd)")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("3. Escribe: npm start")]
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [new TextRun("4. Abre: http://localhost:5000")]
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: "D4A5A0" } },
        spacing: { before: 300 },
        children: [new TextRun({ text: "Hecho con amor para Be·Lu Cerámica Studio", italics: true, color: "9B8B86" })]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("BeluCeramica_Documentacion.docx", buffer);
  console.log("Documento creado exitosamente");
});
