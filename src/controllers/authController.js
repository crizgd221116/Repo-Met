const passport = require('passport');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });


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
        //-------- Número de caracteres de la contraseña------//
    }
    if (password.length < 8) {
        console.log("Las contraseñas deben tener por lo menos 8 caracteres")
        req.flash("error_msg", "Las contraseñas deben tener por lo menos 8 caracteres");
        res.redirect('/users/register');

    } else {
        //------------ Validación usuario existente ------------//
        User.findOne({ email: email }).then(user => {
            if (user) {
                console.log("Correo ya Existe")
                req.flash("error_msg", "Correo ya Existe");
                res.redirect('/users/register');

            } else {
                const oauth2Client = new OAuth2(
                    process.env.CLIENT_ID, // Google ClientID
                    process.env.CLIENT_SECRET, // Google Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );
                console.log(1)

                oauth2Client.setCredentials({
                    refresh_token: process.env.REFRESH_TOKEN
                });

                console.log(2)

                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ name, email, password }, process.env.JWT_KEY, { expiresIn: '5m' });
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <!DOCTYPE html>
                <html>
                <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    /* FONTS */
                    @media screen {
                        @font-face {
                        font-family: 'Lato';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                        }
                        
                        @font-face {
                        font-family: 'Lato';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                        }
                        
                        @font-face {
                        font-family: 'Lato';
                        font-style: italic;
                        font-weight: 400;
                        src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                        }
                        
                        @font-face {
                        font-family: 'Lato';
                        font-style: italic;
                        font-weight: 700;
                        src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                        }
                    }
                    
                    /* CLIENT-SPECIFIC STYLES */
                    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    img { -ms-interpolation-mode: bicubic; }

                    /* RESET STYLES */
                    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                    table { border-collapse: collapse !important; }
                    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

                    /* iOS BLUE LINKS */
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
                    
                    /* MOBILE STYLES */
                    @media screen and (max-width:600px){
                        h1 {
                            font-size: 32px !important;
                            line-height: 32px !important;
                        }
                    }

                    /* ANDROID CENTER FIX */
                    div[style*="margin: 16px 0;"] { margin: 0 !important; }
                </style>
                </head>
                <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">

                

                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- LOGO -->
                    <tr>
                        <td bgcolor="#025955" align="center">
                            <!--[if (gte mso 9)|(IE)]>
                            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                            <tr>
                            <td align="center" valign="top" width="600">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
                                <tr>
                                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                                        <a href="" target="_blank">
                                            <img alt="Logo" src="https://img.pngio.com/cloud-cloudy-sun-sunny-weather-icon-weather-icons-png-512_512.png" width="40" height="40" style="display: block; width: 40px; max-width: 40px; min-width: 40px; font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;" border="0">
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                        </td>
                    </tr>
                    <!-- HERO -->
                    <tr>
                        <td bgcolor="#025955" align="center" style="padding: 0px 10px 0px 10px;">
                            <!--[if (gte mso 9)|(IE)]>
                            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                            <tr>
                            <td align="center" valign="top" width="600">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                    <h1 style="font-size: 48px; font-weight: 400; margin: 0;">Bienvenido!</h1>
                                    </td>
                                </tr>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                        </td>
                    </tr>
                    <!-- COPY BLOCK -->
                    <tr>
                        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                            <!--[if (gte mso 9)|(IE)]>
                            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                            <tr>
                            <td align="center" valign="top" width="600">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
                            <!-- COPY -->
                            <tr>
                                <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                <p style="margin: 0;">Se ha registrado en el Repositorio de Datos Meteorológicos. Primero, debe activar su cuenta. Presione el botón a continuación:</p>
                                </td>
                            </tr>
                            <!-- BULLETPROOF BUTTON -->
                            <tr>
                                <td bgcolor="#ffffff" align="left">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="border-radius: 3px;" bgcolor="#00917c"><a href="${CLIENT_URL}/activate/${token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #ffffff; display: inline-block;">Activar cuenta</a></td>
                                        </tr>
                                        </table>
                                    </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                            <!-- COPY -->
                            <tr>
                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                
                                </td>
                            </tr>
                            <!-- COPY -->
                                <tr>
                                
                                </tr>
                            <!-- COPY -->
                            <tr>
                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                
                                </td>
                            </tr>
                            <!-- COPY -->
                            <tr>
                                
                            </tr>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                        </td>
                    </tr>
                    
                    
                </table>
                    
                </body>
                </html>
                `;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "repometquito@gmail.com",
                        clientId: process.env.CLIENT_ID,
                        clientSecret: process.env.CLIENT_SECRET,
                        refreshToken: process.env.REFRESH_TOKEN,
                        accessToken: accessToken
                    },
                });

                // Envio de correo con transport object
                const mailOptions = {
                    from: '"Repo Admin" <repometquito@gmail.com>', // Dirección de origen
                    to: email, // Destino
                    subject: "Activar cuenta: Repositorio Meteorológico ✔", // Asunto
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

//------------ Manejo de activación de la cuenta ------------//
exports.activateHandle = (req, res) => {
    const token = req.params.token;
    let errors = [];
    if (token) {
        jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
            if (err) {
                console.log("Enlace incorrecto o caducado, vuelva a registrarse")
                req.flash("error_msg", "Enlace incorrecto o caducado, vuelva a registrarse");
                res.redirect('/users/register');
            } else {
                const { name, email, password } = decodedToken;
                User.findOne({ email: email }).then(user => {
                    if (user) {
                        //------------ Usuario Registrado ------------//
                        console.log("Email ingresado ya esta registrado, inicie sesión");
                        req.flash("error_msg", "Email ingresado ya esta registrado, inicie sesión")
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
                    "1443120397-d6qgl41bfq45n0flhhfmvr9fkl6lo2ti.apps.googleusercontent.com", // ClientID
                    "kC_x2z4Zxm4T1VBledyz4hkh", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//040lSyddpWg3rCgYIARAAGAQSNwF-L9IrzD0aqFvM5iVwvwqd_IQYRuDfxgVOonDNEFLjy1XGkjuuDcT9sbPbhKA1yHcDHfrb6lc"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET, { expiresIn: '5m' });
                const CLIENT_URL = 'http://' + req.headers.host;
                const output = `
                
                
                <!DOCTYPE html>
                <html>
                <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    /* FONTS */
                    @media screen {
                        @font-face {
                        font-family: 'Lato';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                        }
                        
                        @font-face {
                        font-family: 'Lato';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                        }
                        
                        @font-face {
                        font-family: 'Lato';
                        font-style: italic;
                        font-weight: 400;
                        src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                        }
                        
                        @font-face {
                        font-family: 'Lato';
                        font-style: italic;
                        font-weight: 700;
                        src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                        }
                    }
                    
                    /* CLIENT-SPECIFIC STYLES */
                    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    img { -ms-interpolation-mode: bicubic; }

                    /* RESET STYLES */
                    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                    table { border-collapse: collapse !important; }
                    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

                    /* iOS BLUE LINKS */
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
                    
                    /* MOBILE STYLES */
                    @media screen and (max-width:600px){
                        h1 {
                            font-size: 32px !important;
                            line-height: 32px !important;
                        }
                    }

                    /* ANDROID CENTER FIX */
                    div[style*="margin: 16px 0;"] { margin: 0 !important; }
                </style>
                </head>
                <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">

                

                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- LOGO -->
                    <tr>
                        <td bgcolor="#025955" align="center">
                            <!--[if (gte mso 9)|(IE)]>
                            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                            <tr>
                            <td align="center" valign="top" width="600">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
                                <tr>
                                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                                        <a href="" target="_blank">
                                            <img alt="Logo" src="https://img.pngio.com/cloud-cloudy-sun-sunny-weather-icon-weather-icons-png-512_512.png" width="40" height="40" style="display: block; width: 40px; max-width: 40px; min-width: 40px; font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;" border="0">
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                        </td>
                    </tr>
                    <!-- HERO -->
                    <tr>
                        <td bgcolor="#025955" align="center" style="padding: 0px 10px 0px 10px;">
                            <!--[if (gte mso 9)|(IE)]>
                            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                            <tr>
                            <td align="center" valign="top" width="600">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                    <h2 style="font-size: 48px; font-weight: 400; margin: 0;">¡Hola!</h2>
                                    </td>
                                </tr>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                        </td>
                    </tr>
                    <!-- COPY BLOCK -->
                    <tr>
                        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                            <!--[if (gte mso 9)|(IE)]>
                            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                            <tr>
                            <td align="center" valign="top" width="600">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
                            <!-- COPY -->
                            <tr>
                                <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                <p style="margin: 0;">Ha solicitado un cambio de contraseña en el Repositorio de Datos Meteorológicos. Por favor, presione el botón a continuación.</p>
                                <p style="margin: 0;">NOTA: el enlace caduca en 5 minutos.</p>
                                
                                </td>
                            </tr>                           
                            
                            
                            <!-- BULLETPROOF BUTTON -->
                            <tr>
                                <td bgcolor="#ffffff" align="left">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="border-radius: 3px;" bgcolor="#00917c"><a href="${CLIENT_URL}/users/recuperar/${token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #ffffff; display: inline-block;">Restablecer contraseña</a></td>
                                        </tr>
                                        </table>
                                    </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>

                            <!-- COPY -->
                            <tr>
                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                
                                </td>
                            </tr>
                            <!-- COPY -->
                                <tr>
                                
                                </tr>
                            <!-- COPY -->
                            <tr>
                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                
                                </td>
                            </tr>
                            <!-- COPY -->
                            <tr>
                                
                            </tr>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                        </td>
                    </tr>
                    
                    
                </table>
                
                </body>
                </html>
                `;

                User.updateOne({ resetLink: token }, (err, success) => {
                    if (err) {
                        console.log("error al cambiar la contraseña")
                    } else {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                type: "OAuth2",
                                user: "repometquito@gmail.com",
                                clientId: process.env.CLIENT_ID,
                                clientSecret: process.env.CLIENT_SECRET,
                                refreshToken: process.env.REFRESH_TOKEN,
                                accessToken: accessToken
                            },
                        });

                        // enviar correo con transport object
                        const mailOptions = {
                            from: '"Repo Admin" <repometquito@gmail.com>', // dirección de envío
                            to: email, // Destino
                            subject: "Restablecimiento de contraseña: Repositorio Meteorológico ✔", // Asunto
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
        jwt.verify(token, process.env.JWT_RESET, (err, decodedToken) => {
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
                            req.logout();



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
    req.flash('success_msg', 'se ha cerrado sesión');
    res.redirect('/index/1');

}