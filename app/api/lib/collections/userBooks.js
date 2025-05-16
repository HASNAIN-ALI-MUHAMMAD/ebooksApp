import mongoose from 'mongoose';

let date =new Date().toISOString();
const users = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    bookId:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:date
    },

},{timestamps:true});
const User = mongoose.models.User ?? mongoose.model('User',users);
export default User;