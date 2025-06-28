import fs from 'fs';
import path from 'path';

const parseCSV = (csv) => {
  const lines = csv.split(/\r?\n/);
  const result = [];
  const headers = lines[0].split(/,(?=(?:(?:[^\"]*"){2})*[^\"]*$)/);

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(/,(?=(?:(?:[^\"]*"){2})*[^\"]*$)/);

    if (currentline.length !== headers.length) {
      // Skip malformed lines
      continue;
    }

    for (let j = 0; j < headers.length; j++) {
      let value = currentline[j] ? currentline[j].replace(/^\"|\"$/g, '') : '';
      obj[headers[j].replace(/^\"|\"$/g, '')] = value;
    }

    result.push(obj);
  }

  return result;
};

const processData = async () => {
  try {
    const safeCsv = fs.readFileSync(path.resolve('./public/data/safe.csv'), 'utf-8');
    const toxicCsv = fs.readFileSync(path.resolve('./public/data/toxic.csv'), 'utf-8');

    const safeJson = parseCSV(safeCsv);
    const toxicJson = parseCSV(toxicCsv);

    fs.writeFileSync(path.resolve('./src/data/safe.json'), JSON.stringify(safeJson, null, 2));
    fs.writeFileSync(path.resolve('./src/data/toxic.json'), JSON.stringify(toxicJson, null, 2));

    console.log('Successfully converted CSV to JSON');
  } catch (error) {
    console.error('Error processing data:', error);
  }
};

processData();
