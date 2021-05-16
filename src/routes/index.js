const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const FileRemmaq = require('../models/FilesRemmaq');

router.get('/index/:page', async(req, res, next) => {
    let perPage = 10;
    let page = req.params.page || 1;
    await FileRemmaq.find()
        .sort({ _id: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, allfiles) => {
            FileRemmaq.count({}, (err, count) => {
                if (err) return next(err);
                // console.log(count)
                // console.log(Math.ceil(count / perPage))
                res.render('index.hbs', {
                    allfiles,
                    page,
                    pages: Math.ceil(count / perPage)

                });

            });
        })
        //console.log(allfiles);

});

router.get('/about', (req, res) => {
    res.render('about.hbs');
});



module.exports = router;