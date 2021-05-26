const express=require('express')
const app=express()
const PORT=process.env.PORT || 5000
const mongoose=require("mongoose")
const {MONGOURI}=require("./config/keys.js")
require("./models/user")
require("./models/post")

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected',()=>{
    console.log("Connected to the database successfully")
})

mongoose.connection.on('error',(err)=>{
    console.log("Unable to connect to the database",err)
})

if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"))
    const path=require("path")
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    })
}

app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))

app.listen(PORT,()=>{
    console.log("Server is running on port,",PORT)
})