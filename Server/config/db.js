

const mongoose = require('mongoose');
const connectDB = async() =>{
  try{
    const conn = await mongoose.connect(process.env.URL);
    console.log(`connected to db of mongoose ${mongoose.connection.host}`);
  }catch (err){
    console.log(`mongo error occured ${err}`);
  }
};

module.exports = connectDB;