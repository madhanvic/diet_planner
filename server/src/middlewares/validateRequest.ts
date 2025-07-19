import { Request, Response, NextFunction } from 'express';
import { ValidationError, validationResult } from 'express-validator';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const parsedError = errors.array().reduce((acc, curr: ValidationError) => {
      if (curr.type === 'field') {
        return {
          ...acc,
          [curr.path]: curr.msg,
        };
      }
      return acc;
    }, {});
    res.status(400).json({ status: 'fail', data: parsedError });
    return;
  }
  next();
};
