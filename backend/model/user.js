var mongoose = require('mongoose');
const uniquevalidator=require('mongoose-unique-validator')
const Schema =mongoose.Schema;
   const user=new Schema({
    email:{type:String,required:true, unique:true},
    password:{type:String},
});
user.plugin(uniquevalidator)
module.exports= mongoose.model('User',user);
