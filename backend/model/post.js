var mongoose = require('mongoose');
const Schema =mongoose.Schema;
   const pod=new Schema({
    title:{type:String,required:true},
    Content:{type:String,required:true},
    imagePath:{type:String,required:true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User",required:true}
});
module.exports= mongoose.model('Post',pod); 