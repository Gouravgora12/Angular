const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../model/user')

exports.createUser=(req,res,next)=>{
    bcrypt.hash(req.body.password,10).then(hash=>{
        const user= new User({
            email:req.body.email,
            password:hash
        })
    user.save().then((data)=>{
        res.status(200).json({message:"user Created",result:data})
    }).catch((error)=>{
        res.status(500).json({message:"User Already Exit"})
        console.log(error)})
    })
}

exports.userLogin=(req,res,next)=>{
    let fetchedUser;
    User.findOne({email:req.body.email}).then((user)=>{
        if(!user)
        {
            return res.status(401).send({message:"Auth Failed"})
        }
        fetchedUser=user
       return bcrypt.compare(req.body.password,fetchedUser.password)
    }).then((result)=>{
        if(!result){
            return res.status(401).send({message:"Auth Failed 2"})
        }
        
        const token=jwt.sign({email:fetchedUser.email,userId:fetchedUser._id},process.env.jwtToken,{
            expiresIn:"1h"
        })
        res.status(200).send({token:token,expiresIn:3600,userId:fetchedUser._id})
    }).catch((error)=>{
        return res.status(401).send({message:"Auth Failed"})
    })
}