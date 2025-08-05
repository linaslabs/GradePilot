import {
  CustomAPIError,
} from "../errors/index.js";

const errorHandler = (err, req, res, next) => {
  let customError = {
    // Creates a custom error object which either uses the error, or defaults if they don't exist
    statusCode: err.statusCode || 500,
    msg: err.message || "Something went wrong, try again later",
  };

  // Handle specific errors and send specific error messages..
  if (err instanceof CustomAPIError){
    return res.status(customError.statusCode).json({ customMessage: customError.msg }); // Returns it as a "customMessage"
  }

  // General error handler
  res.status(customError.statusCode).json({ message: customError.msg });
  console.error({ error: err });
};

export default errorHandler;
