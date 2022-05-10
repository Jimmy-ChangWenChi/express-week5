const Headers = require("../Header/Headers");

function errorHandle(res,message){
    res.writeHead(400,Headers);
    res.write(JSON.stringify({
        "status":"false",
        "massage":message
    }))
    res.end();
}


module.exports = errorHandle;