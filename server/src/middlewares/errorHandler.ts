import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import mongoose, { CastError } from 'mongoose';

const handleCastErrorDB = (error: CastError) => {
  const message = `Invalid ${error.path} : ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = () => {
  const message = `Duplicate field value: Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error: mongoose.Error.ValidationError) => {
  const errorArr = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data. ${errorArr.join(', ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401);
};

const errorHandler: ErrorRequestHandler = (
  error: AppError,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  error.statusCode = error.statusCode ?? 500;
  error.status = error.status ?? 'fail';
  let errorClone = { ...error };
  errorClone.message = error.message;
  errorClone.stack = error.stack;

  if (error.name === 'CastError') {
    errorClone = handleCastErrorDB(errorClone as unknown as CastError);
  }
  if ('code' in error && error.code === 11000) {
    errorClone = handleDuplicateFieldDB();
  }
  if (error.name === 'ValidationError') {
    errorClone = handleValidationErrorDB(
      error as unknown as mongoose.Error.ValidationError,
    );
  }

  if (error.name === 'JsonWbTokenError') {
    errorClone = handleJWTError();
  }

  if (error.name === 'TokenExpiredError') {
    errorClone = handleJWTExpiredError();
  }

  response.status(errorClone.statusCode).json({
    status: errorClone.status,
    error: errorClone,
    message: errorClone.message,
    stack: errorClone.stack,
  });

  console.log(next)

  return;
};

export default errorHandler;
