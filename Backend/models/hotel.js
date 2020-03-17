const mongoose = require('mongoose');

const hotelSchema = mongoose.Schema({
    title : {type:String,  required: true},
    desc: {type:String, required:true},
    imagePath:{type:String, required:true},
    createdDate:{type:String},
    creator:{
        type: mongoose.Schema.Types.ObjectId,
         ref:"User",
          required: true
        }

});

module.exports= mongoose.model('Cities', hotelSchema);