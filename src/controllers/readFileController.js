const XLSX=require('xlsx');
const FileRemmaq = require('../models/FilesRemmaq');
//Lectura de datos excel
exports.subirArchivo = (req,res)=>{
    const { tituloArchivo, origen, magnitud, description } = req.body;

    let newFileRemmaq = new FileRemmaq({ tituloArchivo, origen, magnitud, description });
    console.log(/*newFileRemmaq*/req.file.path);
    console.log(newFileRemmaq);
    
    // 
    var workbook=XLSX.readFile(`${req.file.path}`, {type:'binary',cellText:false,cellDates:true});
    
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]],{header:1,raw:false,dateNF:'yyyy-mm-dd HH:mm:ss'});
    //Cantidad de registros en el archivo
     numestaciones = xlData.length;
     req.body.numestaciones = numestaciones;
    //Fecha de inicio del archivo
     let fechainicio = xlData[3]+'' ;
     let dateleft = fechainicio.split(",",1).toString();
     req.body.firstdate = dateleft;
    
    
     //Fecha de fin del archivo
     let fechafin = xlData[xlData.length-1]+'' ;
     let datefin = fechafin.split(",",1).toString();
     req.body.lastdate = datefin;
     
     // Nombre de estaciones
     let estaciones = xlData[0].filter((estacion) => estacion != null) +'';
     let nombreEstaciones = estaciones.split(",").toString();
     req.body.estacionesname = nombreEstaciones;
      
     numeroRegistros = xlData.length;
     req.body.numregistros = numeroRegistros;
    
     
     res.redirect('/users/resumentablaremmaq.hbs');
}


/*
module.exports={
    leerDatos: leerDatos
}*/