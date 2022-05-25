const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "請輸入您的名字"],
  },
  email: {
    type: String,
    required: [true, "請輸入您的 Email"],
    lowercase: true,
    select: false,
  },
  photo: String,
  sex:{
    type:String,
    enum:["male","female"]
  },
  password:{
    type:String,
    require:[true,"請輸入密碼"],
    minlength:8,
    select:false
  },
  createdAt:{
    type:Date,
    default:Date.now,
    select:false
  }
},
{
    versionKey:false,
    collection:"users" 

    // 要是collection定義users,  
    // 在建立model輸入users,在populate的path輸入users會找不到collection,
    // 解決方法是在建立model輸入user, 在populate的path輸入user 就成功了
}
);

const User = mongoose.model('user', userSchema);

module.exports = User;