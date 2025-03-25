const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.get('/', (req, res)=>{
    res.render('authForms/signup');
});
router.post('/', async(req, res)=>{
    const {username, password} = req.body;
    console.log(username, password);
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({username: username, password: hashedPassword});
    await newUser.save();
    const token = jwt.sign({id: newUser._id, username: newUser.username}, 'mysupersecrettokenkey', {expiresIn:'1h'});
    res.cookie("token", token, {
        httpOnly:true
    });
    const userInfo = {
        username: newUser.username,
        uid:newUser._id
    }
    res.cookie("userInfo",userInfo);
    res.redirect('/home');
    //flash messages to home. signup successful;
});
module.exports = router;