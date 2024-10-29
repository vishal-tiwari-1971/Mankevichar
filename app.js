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
// to allow json format data 
app.use(express.json())
// to get data from forms
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get("/", (req, res) => {
  res.send("<h1>Welcome to Man Ke Vichar</h1> ")
})

app.use("/users", require("./Routes/user.routes"))
app.use("/journal",require("./Routes/journal.routes"))



app.get("/profile", auth, (req, res) => {
  // Access to req.user = { id, email }
  // Query the database based on id and retrieve user info
  // Send a JSON response with user data
});


  module.exports=app