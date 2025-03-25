const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get('/', (req, res)=>{
    res.render('authForms/login');
});
router.post('/', async(req, res)=>{
    const {username, password} = req.body;
    console.log("loignpas", username, password);
    const user = await User.findOne({username: username});
    if(user)
    {
        if(await bcrypt.compare(password, user.password))
        {
            const token = jwt.sign({id: user._id, username: username}, 'mysupersecrettokenkey', {expiresIn:'1h'});
            res.cookie('token', token, {
                httpOnly:true
            });
            const userInfo = {
                username: user.username,
                uid:user._id
            }
            res.cookie("userInfo",userInfo);
        };
        //flash message that signin successful
        return res.redirect('/home');
    }
    return res.send('user not found');
});
module.exports = router;
