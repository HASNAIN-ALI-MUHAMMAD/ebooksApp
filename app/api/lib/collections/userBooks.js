import mongoose from 'mongoose';

let date =new Date().toISOString();
const books = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },username:{
        type:String,
        required:true
    }
    ,
    title:{
        type:String,
        required:true,
        unique:true,
    },
    author:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    bookId:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:date
    },
    link_pdf:{
        type:String,
    },
    url_pdf:{
        type:String,
    },
    status:{
        type:String,
        required:true,
    }


},{timestamps:true});
const User = mongoose.models.userBooks ?? mongoose.model('userBooks',books);
export default User;