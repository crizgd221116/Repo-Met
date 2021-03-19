const express = require('express');
const router = express.Router();

const User = require('../models/User');
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
router.get('/users/uploadrem', isAuthenticated, (req, res) => {
    res.render('users/datosremmaq.hbs');
});
router.get('/users/uploadin', isAuthenticated, (req, res) => {
    res.render('users/datosinamhi.hbs');
});
router.get('/users/hist', isAuthenticated, (req, res) => {
    res.render('users/historial.hbs');
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;