const mongoose = require('mongoose')
const colors = require('colors')
require('dotenv').config()

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{dbName:'neo'})
        console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white);
    }catch(error){
        console.log(`Mongodb server Issue ${error}`.bgRed.white);
    }
}

module.exports = connectDB;