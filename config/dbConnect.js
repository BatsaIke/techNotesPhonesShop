const mongoose = require('mongoose')


const connectDb= async()=>{
    try {
       await mongoose.set("strictQuery", false);
      await mongoose.connect(process.env.MONGO_URI,);  
    } catch (error) {
        console.log(error);
        
    }
}
module.exports =connectDb 

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("Connected to database");
//   })
//   .catch((err) => {
//     console.log(err.message)