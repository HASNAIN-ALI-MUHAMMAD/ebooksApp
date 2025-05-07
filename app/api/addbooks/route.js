import Ebook from "../lib/collections/ebooks.js";
import { booksData } from "../../../public/gutenberg_books/books.js";
import { connectMongo } from "../lib/monoose.js";
import { NextResponse } from "next/server.js";

export async function POST(req){
  const body = await req.json();
  let {author,title,description,file} = body;
  author = author.toString();
  description = description.toString();
  title = title.toString();

  await connectMongo();
  const saveBook = await Ebook.create({
    title,
    author,
    description,
  });
  try{
    await saveBook.save();
    console.log("done book:",saveBook.id);    
  }
  catch(err){
    console.log(err.message)
  }

  return NextResponse.json({message:"done"});

}