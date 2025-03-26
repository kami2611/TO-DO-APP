const express = require('express');
const User = require('../models/user');
const router = express.Router();
const Task = require('../models/task');
const verifyJwt = require('../middlewares/auth');
router.get('/',verifyJwt, async(req, res)=>{
    let status = req.query.status;
    let tasks;
    if(status)
    {
        if(status==='pending')
        {
            let isCompleted = false;
            status = isCompleted;
        }else if(status==='completed')
        {
            let isCompleted = true;
            status = isCompleted;
        }
        const user = await User.findById(req.user.id).populate('tasks');
        tasks = user.tasks.filter((task)=>task.isCompleted===status);
        console.log(status); //completed, pending
    }else{
        const user = await User.findById(req.user.id).populate('tasks');
        tasks = user.tasks;
    }
    console.log(tasks);
    res.render('tasks', {tasks});
});
router.post('/remove', async(req, res)=>{
    console.log(req.body);
    const {taskId} = req.body;
    await Task.findByIdAndUpdate(taskId,{isCompleted:true}, {new:true});
    res.json({completed: true});
})

router.get('/add',verifyJwt, (req, res)=>{
    res.render('addTaskForm');
});
router.get('/:category(work|personal)',verifyJwt, async(req, res)=>{
    const {category} = req.params;
    const user = await User.findById(req.user.id).populate('tasks');
    const tasks = user.tasks.filter((task)=>task.category===`${category}`);
    console.log(category);
    res.render('tasks', {tasks});
});
router.get('/:id', async(req, res)=>{
    console.log(req.params.id);
    const task = await Task.findById(req.params.id);
    if(task)
    {
        return res.render('task', {task});
    }
    return res.sendStatus(404);
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