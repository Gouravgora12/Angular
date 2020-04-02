const jwt =require('jsonwebtoken');

module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        const decoder=jwt.verify(token,process.env.jwtToken)
        req.userData={email:decoder.email,userId:decoder.userId}
        next()
    }
    catch(error){
        res.status(401).json({message:"You are not authenticated"})
}
}