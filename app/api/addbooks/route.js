import Ebook from "../lib/collections/ebooks.js";
import { connectMongo } from "../lib/mongoose.js";
import { NextResponse } from "next/server.js";
import path from "path";
import { supabase } from "./(supabase)/supabase.js"
import fs from "fs/promises";


export async function POST(req){
  await connectMongo();
  try{
    const reqs = await req;
    const sessionToken = reqs.cookies._parsed?.get('next-auth.session-token')?.value;
    const token = reqs.cookies._parsed?.get('token')?.value;
    console.log("token",token);
    console.log("sessionToken",sessionToken);
    if(!token && !sessionToken) return NextResponse.json({error: "You are not logged in!"});
  }catch(err){
    return NextResponse.json({error: "An error occurred!"});
  }



  const body = await req.formData();
  if(!body) return NextResponse.json({error: "No data was fed!"});
  const file= body.get('file');
  const title = body.get('title');
  const description = body.get('description');
  const author = body.get('author');
  const bookId = body.get("bookId");
  const link_pdf = `http://localhost:3000/pdfreader/${bookId}`
  console.log("title",title);

  const isBookFound = await Ebook.findOne({title: title,author:author});
  if(isBookFound) return NextResponse.json({error: "Book already exists!"});

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
  const saveBook = await Ebook.create({
    bookId,
    title,
    author,
    description,
    link_pdf,
    url_pdf:`${publicUrl.publicUrl}`,
    bookType:'userSaved',
    
    });
  try{
    await saveBook.save();
    console.log("done book:",saveBook);    
  }
  catch(err){
    console.log(err.message)
  }

  return NextResponse.json({message:"Book uploaded and saved successfully.",success:true});

}