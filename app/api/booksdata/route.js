import { NextResponse } from "next/server";
import { connectMongo } from "../lib/mongoose";
import Ebook from "../lib/collections/ebooks"; 
import books from '../lib/collections/userBooks';

export async function POST(req) {
    try {
        await connectMongo();
        const ebooks = await Ebook.find({});
        const count = ebooks.length; 
        const books = await books.find({});
        const count2 = books.length;
        const totalCount = count +count2;

        return NextResponse.json({ message: ebooks, length: totalCount, success: true });

    } catch (err) {
        console.error("Error in GET /api/booksdata:", err);
        return NextResponse.json({
            message: "An error occurred while fetching public books.",
            error: err.name || "ServerError", 
            success: false
        }, { status: 500 });
    }
}
