import { connectMongo } from "../lib/mongoose";
import { userData } from "../addbooks/route";
import books from '../lib/collections/userBooks';
import { NextResponse } from "next/server";
import Ebook from "../lib/collections/ebooks";

export async function GET(request) {
    let conn = await connectMongo();
    console.log('connection status mongoose',conn)
    if(!conn){
        return NextResponse.json({error:"An error occurred.Probably due to your network!"})
    }
    try{
        const user = await userData();
        const userId = user?.id || user?.userId;
        const userBooks = await books.find({ userId: userId });
        const publicBooks = await Ebook.find({ userId: userId });
        if((!userBooks || userBooks.length==0) && (!publicBooks || publicBooks.length == 0)) return NextResponse.json({error: "No files found!"});
        const allBooks = [...userBooks, ...publicBooks];
        return NextResponse.json({allBooks});
    }
    catch(err){
        console.log(err)
        return NextResponse.json({error: "An error occurred!"});
    }   


}