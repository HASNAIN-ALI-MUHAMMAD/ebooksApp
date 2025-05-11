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
    verified:{
        type:Boolean,
        default:false
    },
    verificationToken:{
        type:String,
    },
    verificationTokenExpires:{
        type:Date,
    }

},{timestamps:true});
users.pre('save',async function(next){
    if(!this.password) return;
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})
const User = mongoose.models.User ||mongoose.model('User',users);
export default User;