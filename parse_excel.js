const xlsx = require('xlsx');
const path = require('path');

function readExcelFile(filename) {
  const filepath = path.join(__dirname, 'chat de WhatsApp con Daniel Juntos por los Demás', filename);
  const workbook = xlsx.readFile(filepath);
  console.log(`\n========================================`);
  console.log(`FILE: ${filename}`);
  console.log(`========================================\n`);
  
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n--- SHEET: ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    // Dump the first 25 rows to see headers and some data
    for (let i = 0; i < Math.min(25, data.length); i++) {
      console.log(`Row ${i + 1}:`, data[i]);
    }
  });
}

try {
  readExcelFile('Padrinos.xlsx');
} catch (e) {
  console.error(e);
}
