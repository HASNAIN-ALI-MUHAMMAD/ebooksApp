import { NextResponse } from "next/server";
import { connectMongo } from "../../lib/mongoose";
import books from '../../lib/collections/userBooks';
import { userData } from "../../addbooks/route";

export async function POST(req, res) {
    const {userId} = await req.json();
    try{
        await connectMongo();
        if(!userId) return NextResponse.json({error:'You are not signed in! Sign in to view privately uploaded file.'})
        let ebooks = await books.find({userId:user.id});
        const length = await books.length;
        return NextResponse.json({ message:ebooks,length,success:true})
    }
    catch(err){
        return NextResponse.json({ message: err.message,error:err,success:false })
    }

}