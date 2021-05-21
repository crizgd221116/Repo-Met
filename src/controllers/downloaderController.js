
const DataController = require("../controllers/dataController");
const downloadResource = require("../utilities/util");

 const controller = {};

 controller.download = async (req, res) => {
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
const fields = [ '_id','fecha','pertenece','valor' ];
  const dc = new DataController();
  const data2 = await dc.GetDatos(data=>{
    // console.log("--Obtencion de datos---");
    // console.log(data);
    // console.log("--Obtencion de datos---");
    return downloadResource(res, 'test.csv', fields, data);
  })
 }

 module.exports = controller;
