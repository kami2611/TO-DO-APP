const express= require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const signUpRoutes = require('./router/signup');
const loginRoutes = require('./router/login');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const mongoose = require('mongoose');
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/to-do-app').then(() => {
    console.log("Mongoose Server Started!");
}).catch((err) => {
    console.log("Err mongoose!");
});

function verifyJwt(req, res, next){
    const token = req.cookies.token;
    if(!token)
    {
        return res.send('not authenticated');
    }
    const user = jwt.verify(token, 'mysupersecrettokenkey');
    req.user = user;
    next();
}

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.use('/signup',signUpRoutes);
app.use('/login', loginRoutes);

app.get('/home', (req, res)=>{
    res.render('home');
});

app.get('/secret',verifyJwt, (req, res)=>{
    res.send('understand mind');
});
app.get('/decret',verifyJwt, (req, res)=>{
    console.log(req.user);
});

app.listen(3000, ()=>{
    console.log('ON PORT 3000!');
});
