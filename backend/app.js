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

setInterval(async () => {
  const now = new Date();
  await TempUser.deleteMany({ otpExpiration: { $lt: now } }); 
}, 30000*60); 


// Configure CORS
const corsOptions = {
  origin: 'https://mankevichar.vercel.app', // Allow this specific origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Include cookies if needed
};

app.use(cors(corsOptions));


app.get("/", (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*")
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Max-Age", "1800");
//   res.setHeader("Access-Control-Allow-Headers", "content-type");
//   res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
  res.send("Man ke Vichar")
   });

app.use("/user", require("./Routes/user.routes"))
app.use("/journal", require("./Routes/journal.routes"))


module.exports=app
