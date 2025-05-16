import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { cookies } from "next/headers";
import { authOptions } from "@/auth.config";

export async function GET(req) {
    const sessionUser = await getServerSession(authOptions)
        if(sessionUser){
           return NextResponse.json({ user:sessionUser.user});
        }
        const cookie = await cookies();
        const token = await cookie?.get('token')?.value;
        const data =await jwt.verify(token,process.env.NEXTAUTH_SECRET)
        if(token){
            return NextResponse.json({ user:data});
        }

    return NextResponse.json({ message: "Hello World" })
}