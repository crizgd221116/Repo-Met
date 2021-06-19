
const DataController = require("../controllers/dataController");
const downloadResource = require("../utilities/util");
const downloadResourceTxt = require("../utilities/utilTxt");
const downloadResourceXlsx = require("../utilities/utilXlsx");

const controller = {};

controller.download = async (req, res) => {
  const dc = new DataController();
  const data2 = await dc.GetDatos(req.params.id, data => {
    let fields = [];
    if (data[0].tieneNombreEstacion) {
      fields = ['fecha', 'estacion', 'valor'];
    }else{
      fields = ['fecha', 'codigoEstacion', 'valor'];
    }
    return downloadResource(res, `${data[0].magnitudArchivo}` + '.csv', fields, data);
  })
}

controller.downloadTxt = async (req, res) => {
  const dc = new DataController();
  const data2 = await dc.GetDatos(req.params.id, data => {
    return downloadResourceTxt(res, `${data[0].magnitudArchivo}` + '.txt', data);
  })
}

controller.downloadXLSX = async (req, res) => {
  const dc = new DataController();
  const data2 = await dc.GetDatos(req.params.id, data => {
    return downloadResourceXlsx(res, `${data[0].magnitudArchivo}` + '.xlsx', data);
  })
}

module.exports = controller;
