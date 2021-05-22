const express = require("express");
const router = express.Router();
const fileController = require("../controllers/readFileController");

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/index/1');
}

router.get("/users/uploadrem", isAuthenticated, (req, res) => {
    res.render("users/datosremmaq.hbs");
});

router.post("/users/uploadrem", isAuthenticated, async (req, res) => {
    const fileControllerInstance = new fileController();
    fileControllerInstance.ReadContentXlsFile(req.file.path, file => {

        req.body.numestaciones = file.numEstaciones;
        req.body.firstdate = file.fechaInicio;
        req.body.lastdate = file.fechafin;
        req.body.estacionesname = file.nombreEstaciones;
        req.body.numregistros = file.lecturas.length;
        req.body.path = file.path;
        req.body.userid = req.user.id;
        res.render('users/resumenremmaq.hbs', { datosResumen: req.body })
    });
});

router.post('/users/saveremmaq', isAuthenticated, async (req, res, next) => {
    const fileControllerInstance = new fileController();
    fileControllerInstance.ReadContentXlsFile(req.body.path, file => {
        file.userId = req.body.userid;
        req.body.estacionesname = file.nombreEstaciones;
        req.body.numregistros = file.lecturas.length;
        req.body.firstdate = file.fechaInicio;
        req.body.lastdate = file.fechafin;
        file.tituloArchivo = req.body.tituloArchivo;
        file.magnitud = req.body.magnitud;
        file.descripcion = req.body.description;
        fileControllerInstance.SaveFile(file);
        res.render("users/historialArchivos.hbs", { datosResumen: req.body });
    });
});

module.exports = router;