import mongoose from "mongoose";
import { connectMongo } from "../mongoose.js";

const Ebook = mongoose.models.ebooksJSON || mongoose.model("ebooksJSON", new mongoose.Schema({
    bookId:String,
    title: String,
    author: String,
    description: String,
    category: String,
    link_epub:String,
    link_pdf:String,
    url_epub:String,
    url_pdf:String

}, { timeStamps:true}));
export default Ebook;