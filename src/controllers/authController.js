const passport = require('passport');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";

//------------ Modelo Usuario ------------//
const User = require('../models/User');

//------------ Manejo del registro ------------//
exports.registerHandle = (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    console.log(req.body)

    if (!name || !email || !password || !password2) {
        console.log("Ingrese todos los campos")
        req.flash("error_msg", "Ingrese todos los campos");
        res.redirect('/users/register');
    }

    //------------ Validación de contraseña ------------//
    if (password != password2) {

        console.log("las contraseñas no coinciden")
        req.flash("error_msg", "las contraseñas no coinciden");
        res.redirect('/users/register');


    }
    if (password.length < 8) {
        console.log("Las contraseñas deben tener por lo menos 8 caracteres")
        req.flash("error_msg", "Las contraseñas deben tener por lo menos 8 caracteres");
        res.redirect('/users/register');
    } else {
        //------------ Validación exitosa ------------//
        User.findOne({ email: email }).then(user => {
            if (user) {
                console.log("Correo ya Existe")
                req.flash("error_msg", "Correo ya Existe");

                res.redirect('/users/register');
            } else {

                const oauth2Client = new OAuth2(
                    "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
                    "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );
                console.log(1)

                oauth2Client.setCredentials({
                    refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
                });

                console.log(2)

                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ name, email, password }, JWT_KEY, { expiresIn: '3m' });
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Por favor ingrese al enlace a continuación para activar su cuenta</h2>
                <p>${CLIENT_URL}/activate/${token}</p>
                <p><b>NOTE: </b> El enlace de activación caduca en 3 minutos.</p>
                `;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "nodejsa@gmail.com",
                        clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                        clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                        refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                        accessToken: accessToken
                    },
                });

                // Envio de correo con transport object
                const mailOptions = {
                    from: '"Repo Admin" <nodejsa@gmail.com>', // Sender address
                    to: email, // list of receivers
                    subject: "Activar cuenta: Repositorio Meteorológico ✔", // Subject line
                    generateTextFromHTML: true,
                    html: output, // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        res.redirect('/users/login');
                    } else {
                        console.log('Mail sent : %s', info.response);
                        req.flash("success_msg", "Active su cuenta para poder iniciar sesión, revise su correo electrónico");
                        res.redirect('/users/login');
                    }
                })

            }
        });
    }
}

//------------ Manejo de activación de la contraseña ------------//
exports.activateHandle = (req, res) => {
    const token = req.params.token;
    let errors = [];
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                console.log("Enlace incorrecto o caducado, vuelva a registrarse")
                req.flash("error_msg", "Enlace incorrecto o caducado, vuelva a registrarse");
                res.redirect('/users/register');

            } else {
                const { name, email, password } = decodedToken;
                User.findOne({ email: email }).then(user => {
                    if (user) {
                        //------------ User already exists ------------//

                        console.log("Email registrado ya esta registrado, inicie sesión");

                        req.flash("error_msg", "Email registrado ya esta registrado, inicie sesión")


                        res.redirect('/users/login');
                    } else {
                        const newUser = new User({
                            name,
                            email,
                            password
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        console.log("Cuenta Activada, inicie sesión")
                                        req.flash("success_msg", "Cuenta Activada, inicie sesión");
                                        res.redirect('/users/login');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }

        })
    } else {
        console.log("Error en la activación de la cuenta!")
        req.flash("error_msg", "Error en la activación de la cuenta!");
    }
}

//------------ Recuperar Contraseña ------------//
exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    let errors = [];

    //------------ Validación campo vacios ------------//
    if (!email) {
        console.log("Ingrese un email")
        req.flash("error_msg", "Ingrese un email");
        res.redirect('/users/recuperar');
    }

    if (errors.length > 0) {
        console.log("error")
    } else {
        console.log(email)
        User.findOne({ email: email }).then(user => {
            if (!user) {
                //------------ Validación usuario ------------//
                console.log("Usuario no existe")
                req.flash("error_msg", "Usuario no existe");
                res.redirect('/users/recuperar');

            } else {

                const oauth2Client = new OAuth2(
                    "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
                    "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '5m' });
                const CLIENT_URL = 'http://' + req.headers.host;
                const output = `
                <h2>Por favor ingrese al enlace a continuación para restablecer su contraseña</h2>
                <p>${CLIENT_URL}/users/recuperar/${token}</p>
                <p><b>NOTE: </b> El link caduca en 3 minutos.</p>
                `;

                User.updateOne({ resetLink: token }, (err, success) => {
                    if (err) {
                        console.log("error al cambiar la contraseña")
                    } else {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                type: "OAuth2",
                                user: "nodejsa@gmail.com",
                                clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                                clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                                refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                                accessToken: accessToken
                            },
                        });

                        // send mail with defined transport object
                        const mailOptions = {
                            from: '"Repo Admin" <nodejsa@gmail.com>', // sender address
                            to: email, // list of receivers
                            subject: "Restablecimiento de contraseña: Repositorio Meteorológico ✔", // Subject line
                            html: output, // html body
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log("Algo salió mal, intente más tarde");
                                req.flash("error_msg", "Algo salió mal, intente más tarde");

                                res.redirect('/users/recuperar');
                            } else {
                                console.log('Mail sent : %s', info.response);
                                console.log("El link fue enviado a su correo electrónico")
                                req.flash("success_msg", "El enlace de recuperación fue enviado a su correo electrónico");
                                res.redirect('/users/login');
                            }
                        })
                    }
                })

            }
        });
    }
}

//------------ Redirección cambio de contraseña ------------//
exports.gotoReset = (req, res) => {
    const { token } = req.params;

    if (token) {
        jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
            if (err) {
                console.log("El enlace caducó, vuelva a ingresar el correo")
                req.flash("error_msg", "El enlace caducó, vuelve a ingresar el correo");
                res.redirect('/users/recuperar');
            } else {
                const { _id } = decodedToken;
                User.findById(_id, (err, user) => {
                    if (err) {
                        console.log("El usuario con este correo no existe")
                        req.flash("error_msg", "El usuario con este correo no existe");
                        res.redirect('/users/login');
                    } else {
                        res.redirect(`/users/contrasena/${_id}`)
                    }
                })
            }
        })
    } else {
        console.log("Password reset error!")
    }
}


exports.resetPassword = (req, res) => {
    var { password, password2 } = req.body;
    const id = req.params.id;
    let errors = [];

    //------------ Validación campos llenos ------------//
    if (!password || !password2) {
        console.log("ingresen todos los campos")
        req.flash("error_msg", "Ingrese todos los campos");
        res.redirect(`/users/contrasena/${id}`);
    }

    //------------Validación longitud de contraseña ------------//
    else if (password.length < 8) {
        console.log("la contraseña debe tener al menos 8 caracteres")
        req.flash("error_msg", "La contraseña debe tener al menos ocho caracteres");
        res.redirect(`/users/contrasena/${id}`);
    }

    //------------ validación comparar contraseñas------------//
    else if (password != password2) {
        console.log("las contraseñas no coinciden")
        req.flash("error_msg", "las contraseñas no coinciden");
        res.redirect(`/users/contrasena/${id}`);
    } else {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(password, salt, (err, hash) => {
                if (err) throw err;
                password = hash;

                User.findByIdAndUpdate({ _id: id }, { password },
                    function(err, result) {
                        if (err) {
                            console.log("error al restablecer la contraseña")
                            req.flash("error_msg", "Error al restablecer la contraseña");
                            res.redirect(`/users/contrasena/${id}`);
                        } else {
                            console.log("Contraseña restaurada exitosamente")
                            req.flash("success_msg", "Contraseña restaurada exitosamente");
                            res.redirect('/users/login');
                        }
                    }
                );

            });
        });
    }
}

//------------ Manejo login ------------//
exports.loginHandle = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/invest',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
}

//------------ Manejo cerrar sesión ------------//
exports.logoutHandle = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Se ha cerrado sesión');
    res.redirect('/');
}