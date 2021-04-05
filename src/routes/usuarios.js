const express = require('express');
const multer = require('multer');
const xlsxFile = require('read-excel-file/node');
const router = express.Router();
const fs = require('fs');
//Configuracion Fecha
/*const moment = require('moment');
moment.locale('es');
*/
const moment = require('moment-timezone');
moment.locale('es');

const User = require('../models/User');
const FileRemmaq =require('../models/FilesRemmaq');
//------------ Importar controladores  ------------//
const authController = require('../controllers/authController')
const { ensureAuthenticated } = require('../config/checkAuth')
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

router.get('/users/editinfo/:id', ensureAuthenticated, async(req, res) => {
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

router.get('/users/invest', ensureAuthenticated, (req, res) => {
    res.render('users/investigador.hbs', { name: req.user.name });
});
<<<<<<< Updated upstream
//REMMAQ
router.get('/users/uploadrem', isAuthenticated, (req, res) => {
    res.render('users/datosremmaq.hbs');
});

const storage = multer.diskStorage({
    destination:'uploads/',
    filename: function(req,file,callb){
        callb("","remmaq.xlsx");
    }
})
const upload = multer({
    dest: 'uploads/',
    storage:storage
    });
    router.post('/users/uploadrem', isAuthenticated,upload.single('archivoremmaq'), async(req, res) => {
    const {tituloArchivo,origen,magnitud,description} =req.body;
    let newFileRemmaq = new FileRemmaq({tituloArchivo,origen,magnitud,description});
    console.log(newFileRemmaq);
    
    // 
    const rows = await xlsxFile('uploads/'+"remmaq"+".xlsx")
    nombreEstaciones  = rows[0].filter((estacion)=> estacion != null);
    //Estaciones nombres
    estaciones_string ="";
    for (const i in nombreEstaciones) {
        estaciones_string += nombreEstaciones[i]+" ";
    }
    req.body.nombreestaciones = estaciones_string;
    //Cantidad de estaciones
    numestaciones = nombreEstaciones.length;
    req.body.numestaciones = numestaciones;
    //
    numeroRegistros =rows.length;
    req.body.numregistros = numeroRegistros;
    
    /*.then((rows) => {       
        console.log('Existen '+nombreEstaciones.length+ ' estaciones en este archivo :)');
        console.log('registros '+rows.length);
        cantidad =rows.length;
        
        console.log(req.body);
        console.log(cantidad);
        console.log(estaciones_string);
        console.log(numestaciones);
        console.log(moment(rows[2][0]).format("LLLL"));
    console.log(moment(rows[rows.length-1][0],"MMMM DD YYYY,Z").tz("America/Guayaquil"));
    });*/
    //console.log(archivo);
    console.log(moment(rows[2][0]).format("MMMM DD YYYY, h:mm:ss a"));
    console.log(moment(rows[rows.length-1][0]).format("MMMM DD YYYY, h:mm:ss a"));
    newFileRemmaq.nombreestaciones =estaciones_string;
    newFileRemmaq.user = req.user.id;
    await newFileRemmaq.save();
    
    res.render('users/resumenremmaq.hbs',{datosRemmaq: req.body});
});

router.get('/users/archivosRemmaq', isAuthenticated, (req, res) => {
    res.render('users/archivosMetereologicos.hbs');
});

router.get('/users/uploadin', isAuthenticated, (req, res) => {
    res.render('users/datosinamhi.hbs');
});




<<<<<<< HEAD
router.get('/users/hist', isAuthenticated,async(req, res) => {
    const archivos = await FileRemmaq.find({user:req.user.id});
    res.render('users/historialArchivos.hbs',{archivos});
=======
router.post('/users/hist', isAuthenticated, (req, res) => {
    
=======
router.get('/users/uploadrem', ensureAuthenticated, (req, res) => {
    res.render('users/datosremmaq.hbs', { name: req.user.name });
});
router.get('/users/uploadin', ensureAuthenticated, (req, res) => {
    res.render('users/datosinamhi.hbs', { name: req.user.name });
});
router.get('/users/hist', ensureAuthenticated, (req, res) => {
    res.render('users/historial.hbs', { name: req.user.name });
>>>>>>> Stashed changes
>>>>>>> 8bab953692925a0039cc26cb3224ffba8965900c
});



module.exports = router;