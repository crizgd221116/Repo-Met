
const DataController = require("../controllers/dataController");
const downloadResource = require("../utilities/util");

 const controller = {};

 controller.download = async (req, res) => {
  console.log("--RES--");
  console.log(req.params.id);
  console.log("--RES FIN--");
  // console.log("--REQ--");
  //  console.log(req);
  //  console.log("--REQ FIN--");
  // const fields = [
  //   {
  //     label: 'ID',
  //     value: '_id'
  //   },
  //   {
  //     label: 'Encabezado',
  //     value: 'encabezado'
  //   },
  //   {
  //    label: 'Fecha',
  //     value: 'fecha'
  //   },
  //   {
  //    label: 'Pertenece',
  //     value: 'pertenece'
  //   },
  //   {
  //    label: 'Valor',
  //     value: 'valor'
  //   }
  // ];
const fields = [ 'fecha','pertenece','valor' ];
  const dc = new DataController();
  const data2 = await dc.GetDatos(req.params.id,data=>{
    // console.log("--Obtencion de datos---");
    // console.log(data);
    // console.log("--Obtencion de datos---");
    return downloadResource(res, 'test.csv', fields, data);
  })
 }

 module.exports = controller;
