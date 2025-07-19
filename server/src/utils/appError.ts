class AppError extends Error {
  statusCode;
  status;
  operational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = 'fail';
    this.operational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
