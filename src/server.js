const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();

//------------ Passport Configuration ------------//
require('./config/passport')(passport);

//------------ DB Configuration ------------//
const db = require('./config/key').MongoURI;

//------------ Mongo Connection ------------//
mongoose.connect('mongodb+srv://striker19:vmnGW4al2a0j55ah@repositorio.7ffg8.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

//------------ Settings ------------//
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

//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: false }))

app.use(methodOverride('_method'));

//------------ Express session Configuration ------------//
app.use(
    session({
        secret: 'mysecretapp',
        resave: false,
        saveUninitialized: false
    })
);

//------------ Connecting flash ------------//
app.use(flash());

//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session());


//------------ Global variables ------------//
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    app.locals.user = req.user;
    next();
});
//------------ Routes ------------//
app.use(require('./routes/index'));
app.use(require('./routes/usuarios'));



//Static Files
app.use(express.static(path.join(__dirname, '/public')));

//Server is listenning

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});