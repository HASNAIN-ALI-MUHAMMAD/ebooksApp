import { NextResponse } from "next/server";
import { connectMongo } from "../lib/mongoose";
import Ebook from "../lib/collections/ebooks";
import books from '../lib/collections/userBooks'

export async function POST(request) {
  const {bookid}= await request.json();
  console.log(bookid);
  try {
    await connectMongo();
    const book = await Ebook.find({
      bookId: bookid,
    });
    if(!book){
      const userBooks = await books.find({
        bookId: bookid,
      })
      const data = await userBooks;
      return NextResponse.json({ data: data });
    }
    const data = await book;
    return NextResponse.json({ data: data });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" });
  }
}

