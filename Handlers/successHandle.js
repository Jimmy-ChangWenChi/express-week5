const Header = require("../Header/Headers")

function successHanlde(res,posts,message){
    res.writeHead(200,Header);
    res.write(JSON.stringify({
        "status":"success",
        "message":message,
        "data":posts,
    }))
    res.end();//少打這一行 連線會一直持續
}

module.exports = successHanlde
