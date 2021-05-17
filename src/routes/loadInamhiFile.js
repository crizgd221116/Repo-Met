const express = require("express");
const router = express.Router();
var sessionStorage = require('sessionstorage');

const fileController = require("../controllers/readFileController");
const Datos = require("../models/datos");
const { Session } = require("express-session");

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/index/1');
}

router.get("/users/uploadin", isAuthenticated, (req, res) => {
    res.render("users/datosinamhi.hbs");
});


router.post('/users/uploadin', isAuthenticated, (req, res) => {

    const fileControllerInstance = new fileController();
    fileControllerInstance.ReadTxtFile(req.file.path, file => {
        req.body.estacionesname = file.nombreEstaciones;
        req.body.numregistros = file.lecturas.length;
        req.body.firstdate = file.fechaInicio;
        req.body.lastdate = file.fechafin;
        req.body.path = file.path;
        req.body.userid = req.user.id;
        res.render('users/resumentabladatos.hbs', { datosResumen: req.body })
    });

});
router.post('/users/saveinamhi', isAuthenticated, async (req, res, next) => {
    const fileControllerInstance = new fileController();
    fileControllerInstance.ReadTxtFile(req.body.path, file => {
        file.userId = req.body.userid;
        req.body.estacionesname = file.nombreEstaciones;
        req.body.numregistros = file.lecturas.length;
        req.body.firstdate = file.fechaInicio;
        req.body.lastdate = file.fechafin;
        file.tituloArchivo = req.body.tituloArchivo;
        file.descripcion = req.body.description;
         fileControllerInstance.SaveFile(file);
        res.render("users/historialArchivos.hbs", { datosResumen: req.body });
    });
});

module.exports = router;