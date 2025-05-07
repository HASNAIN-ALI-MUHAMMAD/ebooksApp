import mongoose from "mongoose";
import { connectMongo } from "../monoose.js";

const Ebook = mongoose.models.ebooksJSON || mongoose.model("ebooksJSON", new mongoose.Schema({
    title: String,
    author: String,
    description: String,
    category: String,
    url:String

}, { timeStamps:true}));
export default Ebook;