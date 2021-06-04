const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const FileRemmaq = require('../models/encabezado');

router.get('/index/:page', async(req, res, next) => {
    let perPage = 10;
    let page = req.params.page || 1;
    await FileRemmaq.find()
        .sort({ _id: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, allfiles) => {
            FileRemmaq.countDocuments({}, (err, count) => {
                if (err) return next(err);
                res.render('index.hbs', {
                    allfiles,
                    page,
                    pages: Math.ceil(count / perPage)

                });

            });
        })
        //console.log(allfiles);

});

router.get('/', (req, res) => {
    res.redirect('/index/1');
});
router.get('/about', (req, res) => {
    res.render('about.hbs');
});



module.exports = router;