const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const proj4 = require('proj4');
const path = require('path');

// تعريف النظام الإسرائيلي (Israel TM Grid)
proj4.defs("ISR", "+proj=tmerc +lat_0=31.7343936111111 +lon_0=35.2045169444444 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +units=m +no_defs");

// قراءة الملف
router.get('/api/critical-roads', (req, res) => {
  const workbook = XLSX.readFile(path.join(__dirname, '../routes/Roads.xlsx'));
  const allRoads = [];

  workbook.SheetNames.forEach(sheetName => {
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: 0 });
    const road = [];

    for (const row of sheet) {
      const x = row['X (Meters)'];
      const y = row['Y (Meters)'];

      if (typeof x === 'number' && typeof y === 'number') {
        const [lon, lat] = proj4('ISR', 'WGS84', [x, y]);
        road.push([lat, lon]); // lat, lon
      }
    }

    allRoads.push(road);
  });

  res.json(allRoads); // مصفوفة تحتوي على 13 طريق
});

module.exports = router;
