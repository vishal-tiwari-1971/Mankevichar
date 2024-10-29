const mongoose=require('mongoose')
// creating schema for user
const userSchema=new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true,
        minlengh:8
    }
})

const User=mongoose.model('user',userSchema)

module.exports=User;
