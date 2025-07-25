import { body } from 'express-validator';

export const registerUserValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('name').notEmpty().withMessage('Name is required'),

  body('gender').notEmpty().withMessage('Please select gender!'),
];

export const loginUserValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),

  body('password').notEmpty().withMessage('Password is required'),
];
