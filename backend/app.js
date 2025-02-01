require("dotenv").config()
require("./config/database").connect()
const User=require('./model/user')
const Journal=require('./model/journal')
const express = require('express')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cookieParser=require('cookie-parser')
// custom middleware
const auth = require("./middleware/auth")
const app = express()
const cors=require('cors')
const TempUser = require("./model/tempUser");
// to allow json format data 
app.use(express.json())
// to get data from forms
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(cors({
  origin: process.env.FRONTEND_URL
  ,    // Allow this specific origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods,
  allowedHeaders: ['Content-Type', 'Authorization', 'withCredentials'],  // Allow these headers
  credentials: true, // Allow cookies to be sent
  
}));
console.log(process.env.FRONTEND_URL);

setInterval(async () => {
  const now = new Date();
  await TempUser.deleteMany({ otpExpiration: { $lt: now } }); 
}, 30000*60); 

// Configure CORS
// const corsOptions = {
//   origin: 'http://localhost:3000', // Allow this specific origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
//   credentials: true, // Include cookies if needed
// };



// const {frontend}=process.env
// console.log(frontend);

// const whitelist = [process.env.FRONTEND || 'http://localhost:3000'];





app.get("/", (req, res) => {
  res.send("<h1>Welcome to Man Ke Vichar</h1> ") 
   });

app.use("/user", require("./Routes/user.routes"))
app.use("/journal", require("./Routes/journal.routes"))
app.use("/payment",require("./Routes/payment.routes"))


module.exports=app
