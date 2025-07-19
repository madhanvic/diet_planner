import express from 'express';
import {
  AuthLogin,
  getSession,
  protect,
  RegisterUser,
} from './auth.controller';
import { loginUserValidation, registerUserValidation } from './auth.validate';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router
  .route('/register')
  .post(registerUserValidation, validateRequest, RegisterUser);

router.route('/login').post(loginUserValidation, validateRequest, AuthLogin);

router.route('/session').get(protect, getSession);

export default router;
