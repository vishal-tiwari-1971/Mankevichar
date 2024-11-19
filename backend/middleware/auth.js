require("dotenv").config()
// to access jwt
const jwt=require('jsonwebtoken')
const auth=(req,res,next)=>{ 
    console.log(req.cookies);
const {token}=req.cookies
// || req.header||req.body
// or {token}=req.cookies  token=req.cookies.token

// if token is exist
if(!(token)){
  res.status(403).send('login  in again token missing')
}
//  to verify token
try { const decode=jwt.verify(token,process.env.SECRET)
console.log(decode);
req.user=decode 

return next()
// extract id from token and query to database
} catch(error){
    // token not varified
  return res.status(403).send('token is invalid')
}    
}
module.exports=auth


