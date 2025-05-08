import Ebook from "../lib/collections/ebooks.js";
import { connectMongo } from "../lib/monoose.js";
import { NextResponse } from "next/server.js";
import path from "path";
import { supabase } from "./(supabase)/supabase.js"
import fs from "fs/promises";

export async function POST(req){
  await connectMongo();
  const body = await req.formData();
  if(!body) return NextResponse.json({error: "No data was fed!"});
  const file= body.get('file');
  const title = body.get('title');
  const description = body.get('description');
  const author = body.get('author');
  console.log("title",title);
  console.log("description",description);  
  console.log("author",author);  
  const dir = 'public/pdfs'
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = path.join('uploads',file.name)
    const{data,error} = await supabase.storage
    .from('ebooks')
    .upload(filename,buffer,{
      contentType: file.type,
      upsert: true  
    })
    if(error){
      console.log(error);
      return NextResponse.json({error: "Something went wrong!"});
    }
    const {data:publicUrl} = supabase.storage
    .from('ebooks')
    .getPublicUrl(filename)
    console.log("result file upload supabase: ",data);
    console.log(publicUrl.publicUrl)
  const saveBook = await Ebook.create({
    title,
    author,
    description,
    url_pdf:`${publicUrl.publicUrl}`
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