import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

let date =new Date().toISOString();
const users = new mongoose.Schema({
    email:{type:String ,
        unique:true,
        required:true
    },
    password:String,
    date: {
        type: Date,
        default:date
    },
    provider:{
        type:String,
        required:true
    },
    code:{
        type:String
    },
    codeExpiry:{
        type:Date,
    },
    verified:{
        type:Boolean,
    },


},{timestamps:true});
const User = mongoose.models.User ?? mongoose.model('User',users);
export default User;