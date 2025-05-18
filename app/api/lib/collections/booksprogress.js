import mongoose from 'mongoose';

let date =new Date().toISOString();
const booksprogress = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    fileId:{
        type:String,
        required:true,
    },
    currentPage:{
        type:Number
    }


},{timestamps:true});
const User = mongoose.models.booksprogress ?? mongoose.model('booksprogress',booksprogress);
export default User;