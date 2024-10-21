require("dotenv").config()
require("./config/database").connect()
const User=require('./model/user')
const express = require('express')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cookieParser=require('cookie-parser')
// custom middleware
const auth = require("./middleware/auth")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get("/", (req, res) => {
  res.send("<h1>Welcome to VMark</h1> ")
})

// send the data to model or userschema
app.post("/signup", async (req,res)=>{
try {  const {firstName , lastName , mobileNumber, email ,password}=req.body
if(!(firstName && lastName && mobileNumber && email && password))
 return res.status(401).send("<h3>plz fill all the required fields ")

// checking the uniqueness of email
const existUser= await User.findOne({email})
if(existUser)
{ return res.status(400).send(" USer already registered with this email account");
   }

   res.status(201).send("Registered successfully")

  // encryption of password
  const encryptPassword=await bcrypt.hash(password,10)

  // save to db
  const user= await User.create({firstName , lastName, mobileNumber , email , password:encryptPassword }
    )
    const token=jwt.sign({ id:user._id,email} ,process.env.SECRET ,{expiresIn:'2h'})
    user.token=token
    user.password=undefined
    res.status(201).json(user)
 }
catch(error){
  console.log(error);
  console.log("there is an error auth") }
  
})

// for login 
app.post("/login", async (req,res)=>{
  
   try { // collected information from frontend
     const { email , password } = req.body
     // validate
     if(!(email && password))
      res.status(401).send('email and password required')
 // check user in database
   const user=await User.findOne({email})
   // match password
   if(user && await bcrypt.compare(password ,user.password ) )
   {  console.log('login successful') 
    // create token & send
    const token=jwt.sign({id:user._id,email},process.env.SECRET,{expiresIn:'2h'})
     user.password=undefined
     user.token=token

    //  create cookies & send
    const option = {
      expires:new Date(Date.now()+4*24*60*60*1000),
      httpOnly:true
    }
    return res.status(200).cookie('token',token,option).json({
      success:true,
      token,user
    })

   }
   return res.status(400).send('email or password is incorrect')

   
  }
  catch(error) {
    console.log(error);
    console.log('error login');
    
  }
})

// accessing the dashboard , first we checking auth is done or not and we can also customise access like isAdmin , next() is outside so with catch (error) it still goes further
app.get("/dashboard" ,auth, (req,res)=>{

 res.send("Welcome to dashboard ")
})

app.get("/profile", (req,auth,res)=>{
//   //  access to req.user=id,email
//   // based on id , query to DB and get all info of user - findOne({id})
//   // send a json response with all data
})

  module.exports=app