import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { cookies } from "next/headers";
import { authOptions } from "@/auth.config";
import jwt from "jsonwebtoken";

export async function GET(req) {
   try{
        const sessionUser = await getServerSession(authOptions)
        
        if(sessionUser){
           return NextResponse.json({ user:sessionUser.user});
        }
        const cookie = await cookies();
        const token = await cookie?.get('token')?.value;
        if(!token){
        return NextResponse.json({ error: "You are not logged in!"});
        }
        const data =await jwt.verify(token,process.env.NEXTAUTH_SECRET)
        if(token){
            return NextResponse.json({ user:data});
        }
        return NextResponse.json({ error: "You are not logged in!"});
   }     
   catch(err){
    if(err.name == "TokenExpiredError"){
        return NextResponse.json({ error: "Token expired!"});
    }
        return NextResponse.json({ error: "An error occurred!"});
   }

}