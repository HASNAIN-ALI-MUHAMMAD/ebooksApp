import mongoose from "mongoose";
import { connectMongo } from "../monoose.js";

const Ebook = mongoose.models.ebooksJSON || mongoose.model("ebooksJSON", new mongoose.Schema({
    bookId:String,
    title: String,
    author: String,
    description: String,
    category: String,
    link:String,
    url_pdf:String,
    url_epub:String,

}, { timeStamps:true}));
export default Ebook;