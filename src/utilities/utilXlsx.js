const Excel = require('exceljs');
const uuid = require('uuid').v4;

const downloadResourceXlsx = async(res, fileName, data) => {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(`${fileName}`);

    let cabeceraEstacion = "";
    let campoEstacion = "";
    if (data[0].tieneNombreEstacion) {
      cabeceraEstacion = "Estacion";
      campoEstacion = "estacion";
    }else{
      cabeceraEstacion = "Codigo";
      campoEstacion = "codigoEstacion";
    }
    worksheet.columns = [
      {header: 'Fecha', key: 'fecha'},
      {header: cabeceraEstacion, key: campoEstacion},
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
        "attachment; filename=" + `${uuid()}.xlsx`
      );
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
  }
  
  module.exports = downloadResourceXlsx;