import mongoose from "mongoose";
const MONGO_URI = "mongodb+srv://Hasnain:adminHasnain@cluster0.oxu5b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

let isConnected = false;
export const connectMongo = async ()=>{
    if(isConnected) return;
    try{
        await mongoose.connect(MONGO_URI,{
            dbName: "eBooksData"
        });
        isConnected = true;
        console.log("MongoDB Connected")

    }catch(err){
       console.log("Mongoose Connection Error" +err) 
    }

}