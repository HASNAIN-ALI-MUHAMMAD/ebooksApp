import mongoose from "mongoose";
let isConnected = false;
const MONGO_URL = process.env.MONGO_URI;

export const connectMongo=async ()=>{
    if(isConnected) return;
    try{
        await mongoose.connect(MONGO_URL,{
            dbName: "eBooksData"
        });
        isConnected = true;
        console.log("MongoDB Connected")

    }catch(err){
       console.log("Mongoose Connection Error" +err) 
    }

}