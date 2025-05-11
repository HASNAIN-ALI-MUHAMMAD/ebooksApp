import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req, res) {
    try{
        await cookies().delete('token')
        return NextResponse.json({message:"Signed out successfully!"})
    }
    catch(err){
        return NextResponse.json({message:"Error signing out!"})
    }
}