const express=require("express")
const router=express.Router()
const mongoose=require("mongoose")
const User=mongoose.model("User")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")
const {JWT_TOKEN}=require("../config/keys")
const requirelogin=require("../middleware/requirelogin")
const nodemailer=require("nodemailer")
const sendgridTransport=require("nodemailer-sendgrid-transport")


const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))


router.post("/signup",(req,res)=>{
    const {name,email,password,pic} =req.body
    if(!name || !email || !password){
       return  res.status(400).json({error:"Enter all the required fields"})
    }
    User.findOne({email:email})
    .then((saveduser)=>{
        if(saveduser){
            return  res.status(400).json({error:"User already exists"})
        }
        bcryptjs.hash(password,12)
        .then(hashedpassword=>{
            const user=new User({
                email,
                name,
                password:hashedpassword,
                pic
            })
            user.save()
            .then(user=>{
                res.json({message:"Saved Successfully"})
                transporter.sendMail({
                    to:user.email,
                    from:"no-reply@chatterbox.com",
                    subject:"signup successful",
                    html:"<h1>Hey user, Welcome to ChatterBox!!</h1><br/><p>ChatterBox is a user interactive SocialMedia Application where users can connect with others socially, we try our best to create a amicable environment for you...Happy Connecting!!!</p><br/><h5>Regards<br/> ChatterBox team</h5>"
                })
            })
            .catch(error=>{
                console.log(error)
            })
        })
    }).catch(error=>{
        console.log(error)
    })
})

router.post("/signin",(req,res)=>{
    const {email,password} =req.body
    if(!email || !password){
        return  res.status(400).json({error:"Enter all the required fields"})
    }
    User.findOne({email:email})
    .then(saveduser=>{
        if(!saveduser){
            return  res.status(400).json({error:"Invalid credentials"})
        }
        bcryptjs.compare(password,saveduser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"Successfully SignedIN"})
                const token=jwt.sign({_id:saveduser._id},JWT_TOKEN)
                const {_id,name,email,followers,following,pic}=saveduser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return  res.status(402).json({error:"Invalid credentials"}) 
            }
        }).catch(err=>{
            console.log(err)
        })
    })
})
module.exports=router