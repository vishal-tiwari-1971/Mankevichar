const mongoose=require('mongoose')
const { MONGO_URL }=process.env
exports.connect=()=>{
mongoose.connect(MONGO_URL, {
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    
} ).then(() => console.log('MongoDB connected successfully'))
.catch((err) => {console.error('MongoDB connection error:', err);
    console.log(err);
    process.exit(1)
   }) }

   
