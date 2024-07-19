module.exports = {
    sendSuccess: (res, message, data = {}) => {
      res.status(200).json({
        success: true,
        message,
        data,
      });
    },
  
    sendError: (res, errorMessage, statusCode = 400) => {
      res.status(statusCode).json({
        success: false,
        error: errorMessage,
      });
    },
  };