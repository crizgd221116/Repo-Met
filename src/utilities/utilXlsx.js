const Excel = require('exceljs');

const downloadResourceXlsx = async(res, fileName, data) => {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(`test`);
    worksheet.columns = [
      {header: 'Fecha', key: 'fecha'},
      {header: 'Estacion', key: 'estacion'},
      {header: `${data[0].magnitudArchivo}`, key: 'valor'}
    ];
      worksheet.getRow(1).font = {bold: true}

      worksheet.addRows(data)
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + `${fileName}`
      );
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
  }
  
  module.exports = downloadResourceXlsx;