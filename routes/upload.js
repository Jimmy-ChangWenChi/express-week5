const express = require("express");
const router = express.Router();
const appError = require("../service/Error");
const handleErrorAsync = require("../service/handleErrorAsync");
const sizOf = require("image-size");

router.post("/",handleErrorAsync(async(req,res,next) =>{

}))

module.exports = router;