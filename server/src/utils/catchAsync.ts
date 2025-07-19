import { NextFunction, Request, Response } from 'express';

type AsyncCallBack = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const catchAsync = (cb: AsyncCallBack) => {
  return (request: Request, response: Response, next: NextFunction) => {
    cb(request, response, next).catch((error) => {
      next(error);
    });
  };
};

export default catchAsync;
