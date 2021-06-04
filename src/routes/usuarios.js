const express = require("express");
const router = express.Router();

const User = require("../models/User");
const FileRemmaq = require("../models/encabezado");

//------------ Importar controladores  ------------//
const authController = require("../controllers/authController");
const readFileController = require("../controllers/readFileController");
const Datos = require("../models/datos");

//------------ ruta login------------//
router.get("/users/login", (req, res) => res.render("users/login.hbs"));

//------------ recuperar contraseña ------------//
router.get("/users/recuperar", (req, res) => res.render("users/recuperar.hbs"));

//------------ restablecer ------------//
router.get("/users/contrasena/:id", (req, res) => {
  res.render("users/contrasena.hbs", { id: req.params.id });
});

//------------ registro ------------//
router.get("/users/register", (req, res) =>res.render("users/register.hbs"));
  

//------------ Register POST  ------------//
router.post("/users/register", authController.registerHandle);

//------------ Email Activación ------------//
//router.get('users/activate/:token', authController.activateHandle);

router.get("/activate/:token", authController.activateHandle);

//------------ recuperar contraseña validación ------------//
router.post("/users/recuperar", authController.forgotPassword);

//------------ restablecer contraseña datos ------------//
router.post("/users/contrasena/:id", authController.resetPassword);

//------------ recuperar contraseña token ------------//
router.get("/users/recuperar/:token", authController.gotoReset);

//------------ Login POST Handle ------------//
router.post("/users/login", authController.loginHandle);

//------------ Logout GET Handle ------------//

router.get("/users/logout", authController.logoutHandle);

router.get("/users/editinfo/:id", isAuthenticated, async (req, res) => {
  const userAuth = await User.findById(req.params.id);
  res.render("users/editinfo.hbs", { userAuth });
});

router.get("/users/viewencabezados/:id", async (req, res) => {
  const encabezados = await FileRemmaq.findById(req.params.id);
  const file = encabezados.path;
  res.download(file);
});
router.get("/users/datos/:id", async (req, res) => {
  const datos = await Datos.find({"encabezado":req.params.id});
  console.log(datos);
  res.send("DATOS ENVIADOS :)")
});
router.put("/users/editinfo/:id", async (req, res) => {
  const {
    /*genero,titulo,ocupacion,description*/ name,
    email,
    genero,
    titulo,
    ocupacion,
    description,
  } = req.body;
  // console.log(req.body);
  await User.findOneAndUpdate(
    /* req.params.id,{/genero, titulo, ocupacion, descriptionname, email
            } */
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  );
  const userAuth = await User.findById(req.params.id);
  res.render("users/editinfo.hbs", { userAuth });
});

router.get("/users/invest", isAuthenticated, (req, res) => {
  res.render("users/investigador.hbs");
});

router.get("/users/archivosRemmaq", isAuthenticated, (req, res) => {
  res.render("users/archivosMetereologicos.hbs");
});
router.get("/users/hist", isAuthenticated, async (req, res) => {
  const archivos = await FileRemmaq.find({ user: req.user.id });
  console.log(archivos);
  res.render("users/historialArchivos.hbs", { archivos });
});
router.get('/users/hist/:page', isAuthenticated, async (req, res, next) => {
  let perPage = 10;
  let page = req.params.page || 1;

  await FileRemmaq.find({ user: req.user.id })
    .sort({ _id: -1 })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, archivos) => {
      FileRemmaq.countDocuments({ user: req.user.id }, (err, count) => {
        if (err) return next(err);
        // console.log(count)
        // console.log(Math.ceil(count / perPage))
        res.render('users/historialArchivos.hbs', {
          archivos,
          page,
          pages: Math.ceil(count / perPage)

        });

      });
    })
});

router.post('/users/hist/:page', isAuthenticated, async (req, res, next) => {

  res.render("/users/hist/1", { datosResumen: req.body });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;