const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        /*
        name:{
            type:String,
            required:[true,"姓名未填寫"]
        },*/
        user:{
            type: mongoose.Schema.ObjectId,
            ref:"user",
            required:[true,"名稱未填寫"]
        },
        tags:{
            type:String,
            required:[true,"tags 未填寫"]
        },
        content:{
            type:String,
            required:[true,"content 未填寫"]
        },
        createAt:{
            type:Date,
            default:Date.now,
            select:false
        },
        likes:{
            type:Number,
            default:0
        }
    },
    {
        versionKey:false,
        collection:"posts"
    }
)

const POST = mongoose.model("posts",postSchema)

module.exports = POST;
