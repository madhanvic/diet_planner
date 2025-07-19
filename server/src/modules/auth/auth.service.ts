import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from '../../models/Users';
import { NextFunction, Response } from 'express';
import AppError from '../../utils/appError';
import { ProtectedRequest } from '../../types/request';
import { IUser } from '../../models/Users';

export const registerUserService = async (payload: IUser) => {
  const existingUser = await Users.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const newUser = await Users.create({
    ...payload,
    password: hashedPassword,
  });

  return {
    user: newUser,
  };
};

export const loginUserService = async (
  userData: {
    email: string;
    password: string;
  },
  next: NextFunction,
) => {
  const { email, password } = userData;

  const user = await Users.findOne({ email }).lean();

  if (!user) {
    next(new AppError('Account not Registered with the email address', 400));
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    next(new AppError('Invalid Credentials', 400));
    return;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });

  return {
    token,
    user: {
      name: user.name,
      gender: user.gender,
      _id: user._id,
      email: user.email,
      activePlan: user.activePlan,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      goal: user.goal,
      
    },
  };
};

export const protectService = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction,
) => {
  let token;
  console.log(req.headers);

  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    throw new AppError(
      'You are not logged in! Please log in to get access.',
      404,
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);

  const id =
    'id' in (decoded as jwt.JwtPayload) && typeof decoded !== 'string'
      ? decoded.id
      : null;

  if (id === null) {
    throw new AppError('ID not found!', 400);
  }

  const user = await Users.findById(id).select('-password -isActive -__v');

  if (!user) {
    throw new AppError(
      'The token belonging to this user does no longer exist',
      401,
    );
  }

  req.user = user;

  next();
};
