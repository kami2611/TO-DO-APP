const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,  
        default: false
    },
    category:{
        type:String,
        enum:['work', 'personal'],
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
