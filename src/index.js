const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

//Inicializaciones
const app = express();
require('./database');
require('./config/passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('views engine', '.hbs');

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//global variables
app.use((req, res, next) => {
    app.locals.success_msg = req.flash('success_msg');
    app.locals.error_msg = req.flash('error_msg');
    app.locals.error = req.flash('error');
    app.locals.user = req.user;
    next();
});
//Routes
app.use(require('./routes/index'));
app.use(require('./routes/usuarios'));
//Static Files
app.use(express.static(path.join(__dirname, '/public')));


//Server is listenning

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});