const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');


router.get('/', (req, res)=>{
    res.render('login');
});
router.post('/', async(req, res)=>{
    const {username, password} = req.body;
    console.log("loignpas", username, password);
    const user = await User.find({username: username});
    if(user)
    {
        if(await bcrypt.compare(password, user.password))
        {
            
        };
    }
});
module.exports = router;
