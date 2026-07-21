const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\cesar\\Downloads\\Cobranza\\cobranza-mvp\\Chat de WhatsApp con Daniel juntos Por Los Demás';
const files = ['Equino.xlsx', 'Padrinos.xlsx'];

for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
  
  console.log(`\n=== EXCEL: ${file} ===`);
  const workbook = xlsx.readFile(filePath);
  
  for (const sheetName of workbook.SheetNames) {
    console.log(`-- Sheet: ${sheetName} --`);
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    console.log(`Dimensions: ${data.length} rows`);
    console.log('First 3 rows:');
    for (let i = 0; i < Math.min(3, data.length); i++) {
      console.log(JSON.stringify(data[i]).substring(0, 150));
    }
  }
}
