const express = require("express");
const router = express.Router();
const error = require("../Handlers/errorHandle")
const success = require("../Handlers/successHandle");
//const POST = require("../models/postsModel")
const USER = require("../models/usersModel")
const Header = require("../Header/Headers");
const appError = require("../service/Error");
const handleErrorAsync = require("../service/handleErrorAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator =require("validator");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env"});

const generateSendJWT = (user,statusCode,res)=>{

    //每次進來就會產生出新的token, 要是舊的token還沒過期, 就會有多個token產生
    console.log(3);
    //產生token

    const token = jwt.sign({id:user._id,name:user.name},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_DAY
    });
    //console.log(4)
    //console.log(token);
    user.password = undefined;
    res.status(statusCode).json({
        "status":"success",
        user:{
            token,
            name:user.name
        }
    })
}

router.post("/sign_up", handleErrorAsync( async(req,res,next)=>{
    let {name, email, password, confirmPassword} = req.body;
    //console.log(1);

    if(!email||!password||!name||!confirmPassword){
        return next(appError("400","欄位未填寫正確",next))
    }

    if(password !== confirmPassword){
        return next(appError("400","密碼不一致",next))
    }
    
    if(!validator.isLength(password,{min:8})){
        return next(appError("400","密碼字數少於8碼",next));
    }

    if(!validator.isEmail(email)){
        return next(appError("400","mail格式錯誤",next));
    }
    //console.log(2);
    //加密密碼
    password = await bcrypt.hash(req.body.password,12);
    console.log(password);
    const newUser = await USER.create({
        email,
        password,
        name
    });

    //console.log(11);
    generateSendJWT(newUser,201,res);

}));

router.post("/sign_in", handleErrorAsync(async(req,res,next)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(appError("400","帳號密碼不可為空",next));
    }
    const user = await USER.findOne({email}).select("+password"); //＋password, +代表會顯示
    const auth = await bcrypt.compare(password, user.password);
    if(!auth){
        return next(appError("400","密碼不正確",next));
    }
    generateSendJWT(user,200,res);
}));

const isAuth = handleErrorAsync(async(req,res,next)=>{
    //確認token 是否存在
    let token;
    if(req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next(appError("401","你尚未登入",next));
    }

    //驗證token 是否正確
    const decode = await new Promise((resolve,reject)=>{
        jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
            if(err){
                reject(err)
            }else{
                resolve(payload)
            }
        })
    })

    const currentUser = await USER.findById(decode.id);
    req.user = currentUser; //自訂的屬性
    next();
});

router.get("/profile",isAuth,handleErrorAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"success",
        user:req.user
    });
}))

router.post("/updatePassword", isAuth, handleErrorAsync (async(req,res,next)=>{
    const {password, confirmPassword} = req.body;

    if(!validator.isLength(password,{min:8})){
        return next(appError("400","密碼字數少於8碼",next));
    }

    if(password !== confirmPassword){
        return next(appError("400","密碼不一致",next))
    }

    newPassword = await bcrypt.hash(password,12);

    const user = await USER.findByIdAndUpdate(req.user.id,{
        password:newPassword
    });

    generateSendJWT(user,200,res);
}))

router.patch("/profile",isAuth, handleErrorAsync (async(req,res,next)=>{
    const {name,photo,sex} = req.body;

    if(!name || !sex){
        return next(appError("400","請填寫修改資訊",next));
    }
    
    const editUser = await USER.findByIdAndUpdate(req.user.id,{
        name: name,
        photo:photo,
        sex:sex
    });
    const user = await USER.findById(req.user.id)

    res.status(200).json({
        "status":"success",
        user
    });


}))
module.exports = router;