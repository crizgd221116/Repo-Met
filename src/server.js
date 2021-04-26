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
//subir archivos
const multer = require('multer');

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

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
    helpers: {
        eq: function(v1, v2) {
            return v1 === v2;
        },
        ne: function(v1, v2) {
            return v1 !== v2;
        },
        lt: function(v1, v2) {
            return v1 < v2;
        },
        gt: function(v1, v2) {
            return v1 > v2;
        },
        lte: function(v1, v2) {
            return v1 <= v2;
        },
        gte: function(v1, v2) {
            return v1 >= v2;
        },
        and: function() {
            return Array.prototype.slice.call(arguments).every(Boolean);
        },
        or: function() {
            return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
        },
        ap: function(current, pages) {
                var list = []

                var i = (Number(current) > 5 ? Number(current) - 4 : 1)
                if (i !== 1) {
                    var li1 = '<li class="page-item disabled"><a href="#" class="page-link">...</a></li>'

                }
                for (; i <= (Number(current) + 4) && i <= pages; i++) { //for por cada pagina
                    if (i == current) {
                        var li1 = '<li class="page-item active"><a href="' + i + '" class="page-link">' + i + '</a></li>';
                        list.push(li1)
                    } else {
                        var li1 = '<li class="page-item"><a href="/users/hist/' + i + '" class="page-link">' + i + '</a></li>'
                        list.push(li1)
                    }
                    if (i == Number(current) + 4 && i < pages) {
                        var li1 = '<li class="page-item disabled"><a href="#" class="page-link">...</a></li>'

                    }


                } //cierre del for
                var lista = list.join("")
                return lista
            } //cierre de la funcio
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars)



}));

app.set('views engine', 'handlebars');




//------middlewares-----//
app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/uploads')
}).single('archivoremmaq'));
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