const mongoose = require('mongoose');

const fbpostsSchema = mongoose.Schema({
    id :{type:String},
    message : {type:String},
    created_time: {type:String},
    type:{type:String},
  
});

module.exports= mongoose.model('fbposts', fbpostsSchema);