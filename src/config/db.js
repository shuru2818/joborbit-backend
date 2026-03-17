const mongoose =  require ("mongoose");

async function connectDB(){
    try{
        mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb connected ");
        
    }catch(err){
        console.log( err.message, "error is there");
        
    }
}

module.exports = connectDB;