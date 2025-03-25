const express = require('express');
const User = require('../models/user');
const router = express.Router();
const Task = require('../models/task');
const verifyJwt = require('../middlewares/auth');
router.get('/',verifyJwt, async(req, res)=>{
    console.log(req.user.id);
    const user = await User.findById(req.user.id).populate('tasks');
    const tasks = user.tasks;
    console.log(tasks);
    res.render('tasks', {tasks});
});

router.get('/add',verifyJwt, (req, res)=>{
    res.render('addTaskForm');
});
router.get('/:category',verifyJwt, async(req, res)=>{
    const {category} = req.params;
    const user = await User.findById(req.user.id).populate('tasks');
    const tasks = user.tasks.filter((task)=>task.category===`${category}`);
    console.log(category);
    res.render('tasks', {tasks});
});
router.post('/',verifyJwt, async(req, res)=>{
    const { tasktext, taskcategory } = req.body;
    const user = await User.findById(req.user.id);
    console.log("Task Text:", tasktext);
    console.log("Task Category:", taskcategory);
    const newTask = new Task({text:tasktext,category:taskcategory});
    await newTask.save();
    user.tasks.push(newTask._id);
    await user.save();
    res.redirect('/dashboard');
});

module.exports = router;