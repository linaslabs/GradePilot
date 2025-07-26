const errorHandler = (err, req, res, next) => {
  let customError = { // Creates a custom error object which either uses the error, or defaults if they don't exist
		statusCode: err.statusCode || 500,
		msg: err.message || "Something went wrong, try again later",
	}
  
  // Handle specific errors and send specific error messages..
  

  // General error handler
  res.status(customError.statusCode).json(customError.msg);
  console.error({ error: err });
};

export default errorHandler;
