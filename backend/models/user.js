const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    state:{type:Boolean, default:0},
    status: {type:Boolean, default:1}

});


userSchema.plugin(uniqueValidator);
module.exports= mongoose.model('User', userSchema);