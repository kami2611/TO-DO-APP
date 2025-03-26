const express = require('express');
const cookieParser = require('cookie-parser');
const verifyJwt = require('./middlewares/auth');
const signUpRoutes = require('./router/signup');
const loginRoutes = require('./router/login');
const taskRoutes = require('./router/task');
const mongoose = require('mongoose');
const User = require('./models/user');
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/to-do-app').then(() => {
    console.log("Mongoose Server Started!");
}).catch((err) => {
    console.log("Err mongoose!");
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    if (req.cookies.userInfo) {
        res.locals.currentUser = req.cookies.userInfo;
    } else { res.locals.currentUser = null };
    next();
});

app.use('/signup', signUpRoutes);
app.use('/login', loginRoutes);
app.use('/tasks', taskRoutes);
app.get('/logout', verifyJwt, (req, res)=>{
    res.clearCookie('token');
    res.clearCookie('userInfo');
    res.redirect('/home');
});

app.get(['/','/home'], (req, res) => {
    res.render('home');
});
app.get('/getStarted', (req, res) => {
    res.render('signup');
})
app.get('/dashboard',verifyJwt, async(req, res)=>{
    const user = await User.findById(req.user.id).populate('tasks');
    const completedTasks = user.tasks.filter((task)=>task.isCompleted === true).length;
    console.log(completedTasks);
    
    const notcompletedTasks = user.tasks.filter((task)=>task.isCompleted === false).length;
    console.log(completedTasks);
    const totalTasks = user.tasks.length;
    const tasksinfo = {
        completedTasks,notcompletedTasks,totalTasks 
    };

    res.render('dashboard', {tasksinfo});
});

app.listen(3000, () => {
    console.log('ON PORT 3000!');
});
