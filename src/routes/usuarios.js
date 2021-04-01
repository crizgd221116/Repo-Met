const express = require('express');
const multer = require('multer');
const xlsxFile = require('read-excel-file/node');
const router = express.Router();
//Configuracion Fecha
/*const moment = require('moment');
moment.locale('es');*/

const moment = require('moment-timezone');
moment.locale('es');

const User = require('../models/User');
const FileRemmaq =require('../models/FilesRemmaq');
//------------ Importar controladores  ------------//
const authController = require('../controllers/authController')

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
    const {titu,origen,magnitud,description} =req.body;
    const newFileRemmaq = new FileRemmaq({titu,origen,magnitud,description});
    await newFileRemmaq.save();
    console.log(newFileRemmaq);
    xlsxFile('uploads/remmaq.xlsx').then((rows) => {
      
       /* for (i in rows){aasdadlllll12345678
          
            for (j in rows[i]){
                
            }
                
        }*/
        
        nombreEstaciones  = rows[0].filter((estacion)=> estacion != null);
        console.log(nombreEstaciones);
        console.log('Existen '+nombreEstaciones.length+ ' estaciones en este archivo :)');
        console.log('registros '+rows.length);
        console.log(moment(rows[2][0]).format("LLLL"));
        console.log(moment(rows[rows.length-1][0],"MMMM DD YYYY,Z").tz("America/Guayaquil"));
        
    });
    res.send('DATOS RECIBIDOS :)');
});


router.get('/users/uploadin', isAuthenticated, (req, res) => {
    res.render('users/datosinamhi.hbs');
});




router.post('/users/hist', isAuthenticated, (req, res) => {
    
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;