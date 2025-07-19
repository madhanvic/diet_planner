import { NextFunction, Request, Response } from 'express';

import {
  registerUserService,
  loginUserService,
  protectService,
} from './auth.service';
import catchAsync from '../../utils/catchAsync';
import { ProtectedRequest } from '../../types/request';

export const AuthLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await loginUserService(req.body, next);
    res.status(200).json({
      status: 'success',
      token: result?.token,
      data: result?.user,
    });
  },
);

export const RegisterUser = catchAsync(async (req: Request, res: Response) => {
  await registerUserService(req.body);
  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
  });
});

export const getSession = catchAsync(
  async (req: ProtectedRequest, res: Response) => {
    res.status(200).json({
      status: 'success',
      data: req.user,
    });
  },
);

export const protect = catchAsync(protectService);
