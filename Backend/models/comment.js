const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    postid :{type:String},
    id:{type:String},
    username:{type:String,},
    message : {type:String},
    created_time: {type:String},
    
    type:{type:String},
  
});

module.exports= mongoose.model('comments', commentSchema);