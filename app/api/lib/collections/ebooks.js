import mongoose from "mongoose";
import { connectMongo } from "../mongoose.js";

const date = new Date(Date.now());
const Ebook = mongoose.models.ebooksJSON ?? mongoose.model("ebooksJSON", new mongoose.Schema({
    bookId:String,
    title: String,
    author: String,
    description: String,
    category: String,
    link_pdf:String,
    url_pdf:String,
    userId:String,
    status:String,
    createdAt: {
        type: Date,
        default:date
    },

}, { timeStamps:true}));
export default Ebook;