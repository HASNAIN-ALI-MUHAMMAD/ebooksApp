import { NextResponse } from "next/server";
import { connectMongo } from "../lib/mongoose";
import booksprogress from "../lib/collections/booksprogress";
import { userData } from "../addbooks/route";

export async function  POST(req) {
    const {pageNumber,fileId,type} =await req.json();
    let conn = await connectMongo();
    console.log('connection status mongoose',conn)
    if(!conn){
        return NextResponse.json({error:"An error occurred.Probably due to your network!",success:false})
    }
    if(type == 'updatepage'){
        try{
            if(!pageNumber) return NextResponse.json({success:false,error:'No page number!'});
            const user = await userData();
            if(!user) return NextResponse.json({success:false,error:'Not logged in!'});
            const userId = user.id;
            const bookIs = await booksprogress.findOne({userId:userId,fileId:fileId});
            console.log()
            if(bookIs){
                bookIs.currentPage = pageNumber;
                await bookIs.save();
                return NextResponse.json({success:true,message:'Progress saved!'})
            }
            await booksprogress.create({
                userId:userId,
                fileId:fileId,
                currentPage:pageNumber
            })
            return NextResponse.json({success:true,message:'Progress saved!'})
        }
        catch(err){
            return NextResponse.json({success:false,error:err.message})
        }
    }
    else if(type == 'lastpage'){
        try{
            if(!fileId) return NextResponse.json({success:false,error:'No file rendered!'});
            const user = await userData();
            console.log(user)
            if(!user) return NextResponse.json({success:false,error:'Not logged in!'});
            const userId = user.id;
            const bookIs = await booksprogress.findOne({userId:userId,fileId:fileId});
            if(bookIs){
                 let page = bookIs.currentPage;
                return NextResponse.json({success:true,message:'Progress found!',lastPage:page})
            }
            return NextResponse.json({success:true,message:'Welcome!',lastPage:1})
        }
        catch(err){
            return NextResponse.json({success:false,error:err.message})
        }

    }
    




}