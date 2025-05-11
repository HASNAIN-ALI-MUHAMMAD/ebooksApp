import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import User from "../../lib/collections/User";
import crypto from "crypto";
import { connectMongo } from "../../lib/mongoose";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';


export async function POST(req) {
    const reqBody = await req.json();
    const toEmail = await reqBody.email;
    const type = await reqBody.type;
    console.log(type)

    if(type == "email"){
        await connectMongo();
        const ifUser =await User.findOne({email:toEmail,codeExpiry:{$gt:new Date()}}).lean();
        const ifExpiredUser = await User.findOne({email:toEmail,codeExpiry:{$lt:new Date()}}).lean();
        if(ifUser){
            return NextResponse.json({message:"The code was already sent and is valid. Please check your email.And enter the code.",status:401});
        }   
        if(ifExpiredUser || !ifUser){
            await connectMongo();
            const user = await User.deleteOne({email:toEmail,codeExpiry:{$lt:new Date()}}).lean();
            const code = crypto.randomBytes(6).toString('hex');
            const expiry = new Date(Date.now() + 10*1000*60);
            console.log(expiry);
            console.log(typeof expiry);
            console.log(code)
            try{
                const user = await User.create({
                email:toEmail,
                code:code,
                codeExpiry:expiry,
                verified:false,
                provider:'manual'
            })
            console.log(user.toObject())   
            }
            catch(err){
                return NextResponse.json({error:err.message});
            }
        try{
                const userEmailSend = createTransport({
                service: 'gmail',
                auth: {
                    user:process.env.NODE_EMAIL,
                    pass:process.env.NODE_PASS 
                }
            })
            userEmailSend.sendMail({
                from: process.env.NODE_EMAIL,
                to: toEmail,
                subject: 'CODE FOR EMAIL VERIFICATION',
                text: 'Welcome to Ebooks!',
                html: `<h1>Hi ${toEmail},</h1>
                <p>Thank you for signing up to Ebooks!</p>
                <h3>Here is your verification code: ${code}</h3>
                <p>Use this code to verify your email address.</p>
                <p>Best regards,</p>
                <p>Ebooks Team</p>`
            })
        }catch(err){
                return NextResponse.json({error:err.message});
        }

            return NextResponse.json({message: 'Code has been sent!'},{status:200})
    }
    }
    else if(type == "code"){
        const code = await reqBody.code;
        await connectMongo()
        const user = await User.findOne({email:toEmail,code:code,codeExpiry:{$gt:new Date()}});
        if(!user){
            return NextResponse.json({error:'Invalid code or code has expired!'});
        }
        user.verified = true;
        user.code = null;
        user.codeExpiry = null;
        await user.save();
        try{
                const token = jwt.sign(
                    {userId:user._id,email:user.email},
                    process.env.NEXTAUTH_SECRET,
                    {expiresIn:"1h"}
                )
                const cookieSet =await cookies();
                cookieSet?.set('token',token,{
                    httpOnly:true,
                    secure:false,
                    maxAge:60*60*24,
                    path:"/"
                })
            }
            catch(err){
                return NextResponse.json({error:err.message});
            }
        

        return NextResponse.json({message:'Email verified!'});
    }
    return NextResponse.json({error:'Invalid type!'});
}
