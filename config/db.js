const mongoose = require("mongoose");

const connectDB = async() =>{
    const DB_URI = process.env.MONGO_URL
    
    try{
        await mongoose.connect(DB_URI)
        console.log(`\nMONGO DB CONNECTED !!`);

    }catch(err){
        console.log(`MONGODB CONNECTION ERROR: ${err}`);
        process.exit(1);
    }
}

module.exports = connectDB;