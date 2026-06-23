import mongoose, { trusted } from "mongoose";

const userSchema=new mongoose.Schema({
    userAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount"
    },
    sender:{
        type:String,
        required: true,
        enum:["user"]
    },
    text:{
        type:String,
        required:true
    },
    timstamp:{
        type:Date,
        default:Date.now
    }
})

const User=mongoose.model("User",userSchema)
export default User;