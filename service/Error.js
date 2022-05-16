const appError = (httpStatus,errMessage,next) => {
    const error = new Error(errMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error); //這裡的error會跑到 server.js制定的express 錯誤處理 
}

module.exports = appError;