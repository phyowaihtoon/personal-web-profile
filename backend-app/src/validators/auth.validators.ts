import { body } from 'express-validator'

export const bootstrapValidator = [
  body('email').isEmail().withMessage('A valid email address is required.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
]

export const loginValidator = [...bootstrapValidator]