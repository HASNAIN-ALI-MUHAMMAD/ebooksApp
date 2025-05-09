import { NextResponse } from "next/server";
import { connectMongo } from "../lib/monoose";
import Ebook from "../lib/collections/ebooks";

export async function POST(request) {
  const {bookid}= await request.json();
  console.log(bookid);
  try {
    await connectMongo();
    const books = await Ebook.find({
      bookId: bookid,
    });
    const data = await books;
    return NextResponse.json({ data: data });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" });
  }
}

