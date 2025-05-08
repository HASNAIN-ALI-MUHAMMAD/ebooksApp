import { NextResponse } from "next/server";
import { connectMongo } from "../lib/monoose";
import Ebook from "../lib/collections/ebooks";

export async function GET(req, res) {
    try{
        await connectMongo();
        let ebooks = await Ebook.find({});
        const length = await ebooks.length;
        console.log("Length",length);
        return NextResponse.json({ message:ebooks,length,success:true})
    }
    catch(err){
        return NextResponse.json({ message: err.message,error:err,success:false })
    }



}