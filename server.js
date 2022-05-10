const http = require("http");
const mongoose = require("mongoose");
const POST = require("./models/posts");
const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const error = require("./Handlers/errorHandle");
const success = require("./Handlers/successHandle");

const posts = require("./routes/posts");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/posts", posts);

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

//app.listen(process.env.SERVERPORT);
app.listen(process.env.PORT || process.env.SERVERPORT);
