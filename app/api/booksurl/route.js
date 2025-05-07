import { NextResponse } from "next/server";
import { connectMongo } from "../lib/monoose";
import Ebook from "../lib/collections/ebooks";

export async function POST(request) {
  const {bookid}= await request.json();
  console.log(bookid);
  try {
    await connectMongo();
    const books = await Ebook.findOne({
      bookId: bookid,
    });
    const data = await books;
    const url = data.url_epub;
    return NextResponse.json({ data: data });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" });
  }
}
