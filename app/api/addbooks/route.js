import Ebook from "../lib/collections/ebooks.js";
import { connectMongo } from "../lib/mongoose.js";
import { NextResponse } from "next/server.js";
import path from "path";
import { supabase } from "./(supabase)/supabase.js"
import fs from "fs/promises";
import books from '../lib/collections/userBooks.js';
import { cookies } from "next/headers.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config.js";
import jwt from "jsonwebtoken";


export const userData = async ()=>{
    const sessionUser = await getServerSession(authOptions);
    if(sessionUser) return sessionUser?.user;
    const cookie = await cookies();
    const token = await cookie?.get('token')?.value;
    const manData =await jwt.verify(token,process.env.NEXTAUTH_SECRET)
    return manData;

}

export async function POST(req){
  await connectMongo();
    const user =await userData();
    console.log(user)
    const userId = user?.id || user?.userId;
  try{
    const reqs = await req;
    const sessionToken = reqs.cookies._parsed?.get('next-auth.session-token')?.value;
    const token = reqs.cookies._parsed?.get('token')?.value;
    if(!token && !sessionToken) return NextResponse.json({error: "You are not logged in!"});
  }catch(err){
    return NextResponse.json({error: "An error occurred!"});
  }



  const body = await req.formData();
  if(!body) return NextResponse.json({error: "No data was fed!"});
  const file= body.get('file');
  console.log(body)
  const title = body.get('title');
  const description = body.get('description');
  const author = body.get('author');
  const bookId = body.get("bookId");
  const status = body.get("status");
  console.log(status)
  const link_pdf = `http://localhost:3000/pdfreader/${bookId}`;
  await connectMongo();
  const privateBook = await books.findOne({
    title: title,
    author:author,
    userId:userId
  });
  console.log(privateBook)
  const publicBook = await Ebook.findOne({
    title: title,
    author:author,
    userId:userId,
    status:status
  });
  if(privateBook || publicBook) return NextResponse.json({error: "Book with the same title or author already exists!"});
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filenameSplit = file.name.split(' ').join("");
  const filename = (`uploads/${filenameSplit}`)
  console.log("filename: ",filename);
    const{data,error} = await supabase.storage
    .from('ebooks')
    .upload(filename,buffer,{
      contentType: "application/pdf",
      upsert: true  
    })
    if(error){
      console.log(error);
      return NextResponse.json({error: "Something went wrong!"});
    }
    const{data :publicUrl} = supabase.storage
    .from('ebooks')
    .getPublicUrl(filename)
    console.log("result file upload supabase: ",data);
    console.log(publicUrl)
  if(status =='Private'){
    try{
      const saveUserBook = await books.create({
        userId,
        author:author,
        title,
        description,
        bookId,
        link_pdf,
        url_pdf: publicUrl.publicUrl,
        status:status
      });
      await saveUserBook.save();
  }catch(err){
    return console.log(err)
  }
  }
  else if(status == 'Public'){
    try{
      const saveUserBook = await Ebook.create({
        userId,
        author,
        title,
        description,
        bookId,
        link_pdf,
        url_pdf: publicUrl.publicUrl,
        status:status
      });
      await saveUserBook.save();
    }
    catch(err){
      return console.log(err)
    }
  }



  return NextResponse.json({message:"Book uploaded and saved successfully.",success:true});

}