import { connectMongo } from "../app/api/lib/monoose.js";
import Ebook from "../app/api/lib/collections/ebooks.js";
import { booksData } from "./books.js";

async function Trust(){
    try{
        await connectMongo();
        const result = await Ebook.insertMany(booksData);
        console.log("Data deleted Successfully",result.length);

    }
    catch(err){
        console.log(err);
    }

}

Trust();