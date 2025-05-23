import { NextResponse } from "next/server";
import { connectMongo } from "../../lib/mongoose";
import books from '../../lib/collections/userBooks';

export async function POST(req) {
    const { userId } = await req.json();

    try {
        await connectMongo();

        if (!userId || typeof userId !== 'string' || userId.trim() === "") {
            return NextResponse.json({ 
                message: 'User ID is invalid or missing. Please ensure you are logged in.', 
                error: 'AuthenticationError', 
                success: false 
            }, { status: 401 });
        }

        const userEbooks = await books.find({ userId: userId });
        const count = userEbooks.length;

        return NextResponse.json({ message: userEbooks, length: count, success: true });

    } catch (err) {
        console.error("Error in /api/booksdata/private:", err);
        return NextResponse.json({ 
            message: "An error occurred while fetching your private books.",
            error: err.name || "ServerError",
            success: false 
        }, { status: 500 });
    }
}