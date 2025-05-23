import Ebook from "../lib/collections/ebooks.js";
import { connectMongo } from "../lib/mongoose.js";
import { NextResponse } from "next/server.js";
import path from "path";
import fs from "fs/promises";
import books from '../lib/collections/userBooks.js';
import { cookies } from "next/headers.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config.js";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


export const userData = async ()=>{
    const sessionUser = await getServerSession(authOptions);
    if(sessionUser) return sessionUser?.user;
    return null;

}

export async function POST(req){
  await connectMongo();
    const user =await userData();
    const userId = user?.id || user?.userId;
    const username = user?.name|| 'Anonymous'
    if(!user){
      return NextResponse.json('You are not logged in!')
    }



  const body = await req.formData();
  if(!body) return NextResponse.json({error: "No data was fed!"});
  const file= body.get('file');
  const title = body.get('title');
  const description = body.get('description');
  const author = body.get('author');
  const bookId = body.get("bookId");
  const status = body.get("status");
  const link_pdf = `https://ebooks-app-mu.vercel.app/pdfreader/${bookId}`;
  await connectMongo();
  const privateBook = await books.findOne({
    title: title,
    author:author,
    userId:userId
  });
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
    const{data,error} = await supabase.storage
    .from('ebooks')
    .upload(filename,buffer,{
      contentType: "application/pdf",
      upsert: true  
    })
    if(error){
      return NextResponse.json({error: "Something went wrong!"});
    }
    const{data :publicUrl} = supabase.storage
    .from('ebooks')
    .getPublicUrl(filename)
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
        status:status,
        username:username
      });
      await saveUserBook.save();
  }catch(err){
    return err
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
        status:status,
        username:username
      });
      await saveUserBook.save();
    }
    catch(err){
      return err
    }
  }



  return NextResponse.json({message:"Book uploaded and saved successfully.",success:true});

}