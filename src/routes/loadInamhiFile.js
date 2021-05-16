const express = require("express");
const router = express.Router();
const fileController = require("../controllers/readFileController");

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
    fileControllerInstance.ReadTxtFile(req, file => {
        console.log("estructura generada");
        // console.log(file);
        // sessionStorage.setItem('fileGenerated',file);
        console.log('qweq');
        req.body.magnitud = file.magnitud;
        console.log(req.body);
        req.body.estacionesname=file.nombreEstaciones;
        req.body.numregistros=file.lecturas.length;
        req.body.firstdate=file.fechaInicio;
        req.body.lastdate=file.fechafin;
        res.render('users/resumentablaremmaq.hbs',{datosResumen: req.body})
    });
});

module.exports = router;