import * as xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

const dir = 'C:\\Users\\cesar\\Downloads\\Cobranza\\cobranza-mvp\\Chat de WhatsApp con Daniel juntos Por Los Demás';
const files = ['DEMO.xlsx', 'Equino.xlsx', 'LISTA DE PRECIOS 2026.xlsx', 'Padrinos.xlsx'];

for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    continue;
  }
  
  console.log(`\n\n=== EXCEL: ${file} ===`);
  const workbook = xlsx.readFile(filePath);
  
  for (const sheetName of workbook.SheetNames) {
    console.log(`\n-- Sheet: ${sheetName} --`);
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    const numCols = data.length > 0 ? Math.max(...data.map(r => r.length)) : 0;
    console.log(`Dimensions: ${data.length} rows x ${numCols} cols`);
    
    console.log('First 5 rows:');
    for (let i = 0; i < Math.min(5, data.length); i++) {
      console.log(data[i]);
    }
  }
}
