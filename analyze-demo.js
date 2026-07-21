const xlsx = require('xlsx');
const path = require('path');

const dir = 'C:\\Users\\cesar\\Downloads\\Cobranza\\cobranza-mvp\\Chat de WhatsApp con Daniel juntos Por Los Demás';
const filePath = path.join(dir, 'DEMO.xlsx');

console.log(`\n=== EXCEL: DEMO.xlsx ===`);
const workbook = xlsx.readFile(filePath);

for (const sheetName of workbook.SheetNames) {
  console.log(`-- Sheet: ${sheetName} --`);
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  console.log(`Dimensions: ${data.length} rows`);
  console.log('First 5 rows:');
  for (let i = 0; i < Math.min(5, data.length); i++) {
    console.log(JSON.stringify(data[i]).substring(0, 200));
  }
}
