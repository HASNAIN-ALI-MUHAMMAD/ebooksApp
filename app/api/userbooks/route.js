import { connectMongo } from "../lib/mongoose";
import { userData } from "../addbooks/route";
import books from '../lib/collections/userBooks';
import { NextResponse } from "next/server";

export async function GET(request) {
    let conn = await connectMongo();
    console.log('connection status mongoose',conn)
    if(!conn){
        return NextResponse.json({error:"An error occurred.Probably due to your network!"})
    }
    try{
        const user = await userData();
        const userId = user?.id || user?.userId;
        console.log('userid',userId)
        const userBooks = await books.find({ userId: userId });
        if(!userBooks || userBooks.length==0) return NextResponse.json({error: "No books found!"});
        return NextResponse.json({userBooks});
    }
    catch(err){
        console.log(err)
        return NextResponse.json({error: "An error occurred!"});
    }   


}