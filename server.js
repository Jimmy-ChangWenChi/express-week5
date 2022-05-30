const http = require("http");
const mongoose = require("mongoose");
const POST = require("./models/postsModel");
const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env"});

//重大錯誤
process.on("uncaughtException",err=>{
    console.error("Uncaught Exception!")
    console.error(err);
    process.exit(1);
})

const error = require("./Handlers/errorHandle");
const success = require("./Handlers/successHandle");

const posts = require("./routes/posts");
const users = require("./routes/users");
const upload = require("./routes/upload");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/posts", posts);
app.use("/users", users);
app.use("/upload",upload);

//設定資料庫資料
const DB = process.env.MONGODB.replace('<password>', process.env.PW);
//連線資料庫
mongoose.connect(DB)
    .then(() => {
        console.log("資料庫連線成功")
    })
    .catch((error) => {
        console.log(error);
    })
// const requestListener = async function (req, res) {
//     router(req,res);
// }

////建立 server
// const server = http.createServer(requestListener);

// server.listen(process.env.PORT || process.env.SERVERPORT);

//404錯誤
app.use(function(req,res,next){
    res.status(404).json({
        status:"false",
        message:"找不到路由"
    })
})

//express 錯誤處理
//正式環境錯誤
const resErrorProd = (err,res)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            message:err.message
        });
    }else{
        console.error("出現重大訊息",err);
        res.status(500).json({
            status:"error",
            message:"系統錯誤,請找系統管理員"
        })
    }

};
//開發環境錯誤
const resErrorDev = (err,res)=>{
    res.status(err.statusCode).json({
        message:err.message,
        error:err,
        statck:err.statck
    });
}

app.use(function(err,req,res,next){
    //dev
    err.statusCode = err.statusCode || 500;
    if(process.env.NODE_ENV === "dev"){
        return resErrorDev(err,res);
    }
    //production
    if(err.name === "ValidationError"){
        err.message = "資料欄位未填寫正確,請重新輸入";
        err.isOperational = true;
        return resErrorProd(err,res)
    }
    resErrorProd(err,res)
})

//未捕捉到的catch
process.on("unhandledRejection",(err,promise) => {
    console.log("未捕捉到的 rejection:",promise,"原因:",err)
})


//app.listen(process.env.SERVERPORT);
app.listen(process.env.PORT || process.env.SERVERPORT);
