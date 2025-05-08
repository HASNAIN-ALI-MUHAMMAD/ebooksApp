import Ebook from "../lib/collections/ebooks.js";
import { connectMongo } from "../lib/monoose.js";
import { NextResponse } from "next/server.js";
import { writeFile } from "fs-extra";
import { tmpdir } from "os";
import path from "path";
import { supabase } from "./(cloudinary)/supabase.js"

export async function POST(req){
  const body = await req.formData();
  if(!body) return NextResponse.json({error: "No data was fed!"});
  const file= body.get('file');
  const title = body.get('title');
  const description = body.get('description');
  const author = body.get('author');
  console.log("title",title);
  console.log("description",description);  
  console.log("author",author);  


  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = path.join('1',file.name)
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
    console.log("result",data);
    return NextResponse.json({data,url:publicUrl});



  // let {author,title,description,file} = body;
  // author = author.toString();
  // description = description.toString();
  // title = title.toString();

  // await connectMongo();
  // const saveBook = await Ebook.create({
  //   title,
  //   author,
  //   description,
  // });
  // try{
  //   await saveBook.save();
  //   console.log("done book:",saveBook.id);    
  // }
  // catch(err){
  //   console.log(err.message)
  // }

  return NextResponse.json({message:"done"});

}