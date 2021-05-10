const express = require('express');
const multer = require('multer');
const xlsxFile = require('read-excel-file/node');
const router = express.Router();
const fs = require('fs');
//Configuracion Fecha
/*const moment = require('moment');
moment.locale('es');
*/
const XLSX = require('xlsx');

const User = require('../models/User');
const FileRemmaq = require('../models/FilesRemmaq');
//------------ Importar controladores  ------------//
const authController = require('../controllers/authController')
const readFileController = require('../controllers/readFileController');

//------------ ruta login------------//
router.get('/users/login', (req, res) => res.render('users/login.hbs'));

//------------ recuperar contraseña ------------//
router.get('/users/recuperar', (req, res) => res.render('users/recuperar.hbs'));

//------------ restablecer ------------//
router.get('/users/contrasena/:id', (req, res) => {
    res.render('users/contrasena.hbs', { id: req.params.id });
});

//------------ registro ------------//
router.get('/users/register', (req, res) => res.render('users/register.hbs'));

//------------ Register POST  ------------//
router.post('/users/register', authController.registerHandle);

//------------ Email Activación ------------//
//router.get('users/activate/:token', authController.activateHandle);

router.get('/activate/:token', authController.activateHandle);

//------------ recuperar contraseña validación ------------//
router.post('/users/recuperar', authController.forgotPassword);

//------------ restablecer contraseña datos ------------//
router.post('/users/contrasena/:id', authController.resetPassword);

//------------ recuperar contraseña token ------------//
router.get('/users/recuperar/:token', authController.gotoReset);

//------------ Login POST Handle ------------//
router.post('/users/login', authController.loginHandle);

//------------ Logout GET Handle ------------//

router.get('/users/logout', authController.logoutHandle);

router.get('/users/editinfo/:id', isAuthenticated, async(req, res) => {
    const userAuth = await User.findById(req.params.id);
    res.render('users/editinfo.hbs', { userAuth });
});

router.put('/users/editinfo/:id', async(req, res) => {
    const { /*genero,titulo,ocupacion,description*/ name, email, genero, titulo, ocupacion, description } = req.body;
    console.log(req.body);
    await User.findOneAndUpdate(
        /* req.params.id,{/genero, titulo, ocupacion, descriptionname, email
            } */
        { _id: req.params.id }, { $set: req.body }, { new: true }
    );
    const userAuth = await User.findById(req.params.id);
    res.render('users/editinfo.hbs', { userAuth });
});

router.get('/users/invest', isAuthenticated, (req, res) => {
    res.render('users/investigador.hbs');
});

//REMMAQ
router.get('/users/uploadrem', isAuthenticated, (req, res) => {
    res.render('users/datosremmaq.hbs');
});

router.post('/users/uploadrem', isAuthenticated, async(req, res) => {
    const { tituloArchivo, origen, magnitud, description } = req.body;
    let newFileRemmaq = new FileRemmaq({ tituloArchivo, origen, magnitud, description });
    console.log( /*newFileRemmaq*/ req.file.path);

    // 
    var workbook = XLSX.readFile(`${req.file.path}`, { type: 'binary', cellText: false, cellDates: true });

    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { header: 1, raw: false, dateNF: 'yyyy-mm-dd HH:mm:ss' });
    //Cantidad de registros en el archivo
    numestaciones = xlData.length;
    req.body.numestaciones = numestaciones;
    //Fecha de inicio del archivo
    var fechainicio = xlData[3] + '';
    var dateleft = fechainicio.split(",", 1).toString();
    req.body.firstdate = dateleft;


    //Fecha de fin del archivo
    var fechafin = xlData[xlData.length - 1] + '';
    var datefin = fechafin.split(",", 1).toString();
    req.body.lastdate = datefin;

    // Nombre de estaciones
    var estaciones = xlData[0].filter((estacion) => estacion != null) + '';
    var nombreEstaciones = estaciones.split(",").toString();
    req.body.estacionesname = nombreEstaciones;

    numeroRegistros = xlData.length;
    req.body.numregistros = numeroRegistros;

    var path = req.file.path;

    newFileRemmaq.user = req.user.id;
    newFileRemmaq.nombreestaciones = nombreEstaciones;
    newFileRemmaq.fechainicio = dateleft;
    newFileRemmaq.fechafin = datefin;
    newFileRemmaq.path = path;

    await newFileRemmaq.save();

    res.render('users/resumentablaremmaq.hbs', { datosRemmaq: req.body });
});


router.get('/users/archivosRemmaq', isAuthenticated, (req, res) => {
    res.render('users/archivosMetereologicos.hbs');
});
//INHAMI
router.get('/users/uploadin', isAuthenticated, (req, res) => {
    res.render('users/datosinamhi.hbs');
});
router.post('/users/uploadin', isAuthenticated, (req, res) => {
    var fs = require("fs");
    fs.readFile(`${req.file.path}`, 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        } else {
            // console.log(data.to);
            console.log(typeof(data));
            let lector = readline.createInterface({
                input: fs.createReadStream(`${req.file.path}`)
            });
            lector.on("line", linea => {
                console.log("Tenemos una línea:", linea[1]);
            });
        }
    })


    //     const readline = require("readline"),
    //     fs = require("fs"),
    //     NOMBRE_ARCHIVO = 'uploads/inhami.txt';

    //     let lector = readline.createInterface({
    //     input: fs.createReadStream(NOMBRE_ARCHIVO)
    // });

    // lector.on("line", linea => {
    //     console.log("Tenemos una línea:", linea);
    // });
    res.send('cargado');
});

router.get('/users/hist', isAuthenticated, async(req, res) => {
    const archivos = await FileRemmaq.find({ user: req.user.id });
    console.log(archivos);
    res.render('users/historialArchivos.hbs', { archivos });
});
router.get('/users/hist/:page', isAuthenticated, async(req, res, next) => {
    let perPage = 10;
    let page = req.params.page || 1;

    await FileRemmaq.find({ user: req.user.id })
        .sort({ _id: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, archivos) => {
            FileRemmaq.count({ user: req.user.id }, (err, count) => {
                if (err) return next(err);
                console.log(count)
                console.log(Math.ceil(count / perPage))
                res.render('users/historialArchivos.hbs', {
                    archivos,
                    page,
                    pages: Math.ceil(count / perPage)

                });

            });
        })


});



function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;