import { NextResponse } from "next/server";
import { connectMongo } from "../lib/mongoose";
import Ebook from "../lib/collections/ebooks";
import UserBooks from '../lib/collections/userBooks';

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const bookIdToFind = body?.bookid;

  if (!bookIdToFind) {
    return NextResponse.json({ error: "Book ID (bookid) is missing in the request body", success: false }, { status: 400 });
  }

  try {
    await connectMongo();
    let foundBook;
    
    foundBook = await Ebook.findOne({ bookId: bookIdToFind });

    if (foundBook && foundBook.url_pdf) {
      return NextResponse.json({
        success: true,
        data:foundBook
      });
    }

    foundBook = await UserBooks.findOne({ bookId: bookIdToFind });

    if (foundBook && foundBook.url_pdf) {
        return NextResponse.json({
          success: true,
          data:foundBook
        });
      }
    
    return NextResponse.json({ error: "Book not found or PDF link is unavailable", success: false }, { status: 404 });

  } catch (error) {
    console.error("Server error in getbookpdfdetails route:", error);
    return NextResponse.json({ error: "Server error occurred while fetching book PDF details", success: false }, { status: 500 });
  }
}