const express= require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose')
const postRoutes=require('./routes/posts')
const userRoutes=require('./routes/user')
const path=require('path')
var cors=require('cors')
const url=`mongodb+srv://bunny:${process.env.pass}@cluster0-y59w4.mongodb.net/test?retryWrites=true&w=majority`;
// var options = {
//     autoIndex: false, 
//     reconnectTries: Number.MAX_VALUE, 
//     reconnectInterval: 500, 
//     poolSize: 10, 
//     bufferMaxEntries: 0,
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   };
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images',express.static(path.join('images')))
//Cors Error
app.use(cors())
//DataBase Connection
mongoose.connect(url).then(()=>{
    console.log("Connected to DataBase");
}).catch(()=>{
    console.log("Unable to Connect")
});
//End Point
app.use('/api/user/posts',postRoutes)
app.use('/api/user',userRoutes)

module.exports=app;