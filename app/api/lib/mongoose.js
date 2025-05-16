import mongoose from "mongoose";
import { NextResponse } from "next/server";
let isConnected = false;
const MONGO_URL = process.env.MONGO_URI;

export const connectMongo=async ()=>{
    if(isConnected) return;
    try{
        await mongoose.connect(MONGO_URL,{
            dbName: "eBooksData"
        });
        isConnected = true;
        return true
    }catch(err){
        return false
    }

}