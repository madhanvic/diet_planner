import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/appError';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.body.user = decoded;
    req.query.user = decoded;
    next();
  } catch (error) {
    next(error instanceof Error ? error : new ApiError(500, 'Unknown error'));
  }
};
