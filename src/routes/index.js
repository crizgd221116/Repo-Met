const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const FileRemmaq = require('../models/FilesRemmaq');

router.get('/', async(req, res) => {
    const allfiles = await FileRemmaq.find()
        .sort({ _id: -1 });
    //console.log(allfiles);
    res.render('index.hbs', { allfiles });
});
router.get('/about', (req, res) => {
    res.render('about.hbs');
});



module.exports = router;