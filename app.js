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

app.use("/users", require("./Routes/user.routes"))




app.get("/profile", (req,auth,res)=>{
//   //  access to req.user=id,email
//   // based on id , query to DB and get all info of user - findOne({id})
//   // send a json response with all data
})

  module.exports=app