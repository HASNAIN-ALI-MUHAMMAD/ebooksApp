import { NextResponse } from "next/server";
import { connectMongo } from "../lib/mongoose";
import Ebook from "../lib/collections/ebooks";

export async function POST(req, res) {
    try{
        await connectMongo();
        let ebooks = await Ebook.find({});
        const length = await ebooks.length;
        return NextResponse.json({ message:ebooks,length,success:true})
    }
    catch(err){
        return NextResponse.json({ message: err.message,error:err,success:false })
    }

}