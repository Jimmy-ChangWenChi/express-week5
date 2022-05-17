const handleErrorAsync = function handleErrorAsync(func){
    //func 先將async func帶入參數儲存
    //middleware 先接住router 資料

    //此func 是從posts的router.post 的 async(req,res,next)
    //等同於 
    // const func = async (req, res, next) => { //要記得next, 否則service/Error.js 無法使用
    //     const data = req.body;
    //     if (data.content == undefined) {
    //         return next(appError(400, "未填寫content 資料", next))
    //     }
    // }


    return function(req,res,next){
        //在執行函式,async 可用catch 做全域捕捉、統一捕捉
        func(req,res,next).catch(
            function (error){
                return next(error)
            }
        )
    }
}



module.exports = handleErrorAsync;