const express = require('express');
const music = require('../models/music')
const router = express.Router();

router.get('/', async(req,res)=>{
    await music.find().then((result)=>{
        res.render('home', {music:result});
    }).catch((err)=>{console.log(err)})
});

router.get('/search', async(req,res)=>{
    const searchreq = req.query.search;
    const search = searchreq.trim();
    await music.find({$or: [{name: search},{author: search}]}).then((result)=>{
        res.render('search', {result, search})
    }).catch((err)=>{
        console.log(err);
    })
});




module.exports = router;