import mongoose from "mongoose";
let isConnected = false;
const MONGO_URL = process.env.MONGO_URI;

export const connectMongo=async ()=>{
    if(isConnected) return true;
    try{
        await mongoose.connect(MONGO_URL,{
            dbName: "eBooksData"
        });
        isConnected = true;
        return true
    }catch(err){
        console.log("MongoDB connection error:", err);
        return false
    }

}