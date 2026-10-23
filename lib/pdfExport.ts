'use client';

interface PDFExportOptions {
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  category?: string;
  sections: {
    heading: string;
    content?: string;
    items?: string[];
    table?: { headers: string[]; rows: string[][] };
  }[];
  filename?: string;
}

export function exportToPDF({
  title,
  subtitle,
  author = 'GramSathi Agricultural Intelligence Platform',
  date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
  category = 'Government Advisory / Bulletin',
  sections,
  filename = 'GramSathi-Document.pdf'
}: PDFExportOptions) {
  if (typeof window === 'undefined') return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download/print the PDF document.');
    return;
  }

  const sectionsHTML = sections.map(sec => `
    <div style="margin-bottom: 24px; page-break-inside: avoid;">
      <h3 style="color: #065f46; font-size: 16px; font-weight: 700; border-bottom: 2px solid #a7f3d0; padding-bottom: 6px; margin-bottom: 12px; font-family: sans-serif;">
        ${sec.heading}
      </h3>
      ${sec.content ? `<p style="font-size: 13px; color: #374151; line-height: 1.6; margin-bottom: 10px; font-family: sans-serif;">${sec.content}</p>` : ''}
      ${sec.items ? `
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #1f2937; line-height: 1.7; font-family: sans-serif;">
          ${sec.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      ` : ''}
      ${sec.table ? `
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; font-family: sans-serif;">
          <thead>
            <tr style="background-color: #ecfdf5; border-bottom: 2px solid #059669;">
              ${sec.table.headers.map(h => `<th style="padding: 8px 12px; text-align: left; color: #065f46; font-weight: 700;">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${sec.table.rows.map((row, i) => `
              <tr style="border-bottom: 1px solid #e5e7eb; background-color: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                ${row.map(cell => `<td style="padding: 8px 12px; color: #374151;">${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
    </div>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - GramSathi PDF</title>
        <meta charset="utf-8" />
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; background: #ffffff; padding: 20px; }
          .header { border-bottom: 3px solid #059669; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 22px; font-weight: 800; color: #065f46; margin: 0 0 6px 0; }
          .subtitle { font-size: 13px; color: #4b5563; margin: 0; }
          .badge { display: inline-block; padding: 4px 10px; background: #d1fae5; color: #065f46; font-weight: 700; font-size: 11px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 10px; }
          .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 12px; text-align: center; font-size: 11px; color: #6b7280; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; padding: 12px; background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 12px; text-align: right;">
          <button onclick="window.print()" style="padding: 8px 20px; background: #059669; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">
            🖨️ Save as PDF / Print
          </button>
        </div>

        <div class="header">
          <div>
            <span class="badge">${category}</span>
            <h1 class="title">${title}</h1>
            ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
          </div>
          <div style="text-align: right; font-size: 12px; color: #4b5563;">
            <p style="margin: 0; font-weight: 700; color: #059669;">🌱 GramSathi AI</p>
            <p style="margin: 2px 0 0 0;">${date}</p>
            <p style="margin: 2px 0 0 0; font-size: 10px; color: #9ca3af;">${author}</p>
          </div>
        </div>

        ${sectionsHTML}

        <div class="footer">
          <p>GramSathi Agricultural Intelligence Platform · Official Verified Document · Powered by ICAR & IMD Telemetry</p>
          <p style="font-size: 9px; color: #9ca3af; margin-top: 4px;">Notice: All advisory recommendations follow Integrated Pest Management (IPM) guidelines.</p>
        </div>

        <script>
          setTimeout(() => { window.print(); }, 500);
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
