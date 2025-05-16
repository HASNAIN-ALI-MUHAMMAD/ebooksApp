import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export async function GET(request) {
    try{
      const session = await getServerSession(authOptions);
        if(session){
           return NextResponse.json({ user:session.user.email});
        }
        const cookie = await cookies();
        const token = await cookie?.get('token')?.value;
        const data =await jwt.verify(token,process.env.NEXTAUTH_SECRET)
        if(token){
            return NextResponse.json({ user:data.email});
        }
    }catch(err){
        return NextResponse.json({ message:"No user found"});
    }

  return NextResponse.json({ message:"No user found"});
}