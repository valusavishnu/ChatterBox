const jwt=require("jsonwebtoken")
const {JWT_TOKEN}=require("../config/keys")
const mongoose=require("mongoose")
const User=mongoose.model("User")

module.exports=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
        return res.status(401).json({error:"You must be LoggedIN"})
    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,JWT_TOKEN,(error,payload)=>{
        if(error){
            return res.status(401).json({error:"You must be LoggedIN"})        
        }
        const {_id}=payload
        User.findById(_id).then(userdata=>{
            req.user=userdata
            next()
        })

    })
}