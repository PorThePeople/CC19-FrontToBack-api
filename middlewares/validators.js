const { z } = require('zod');

exports.registerSchema = z
  .object({
    email: z.string().email('Email invalid format'),
    firstname: z.string().min(3, 'Firstname must be longer than 3 characters'),
    lastname: z.string().min(3, 'Lastname must be longer than 3 characters'),
    password: z.string().min(6, 'Password must be longer than 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be longer than 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password ไม่ตรงกัน',
    path: ['confirmPassword'],
  });

exports.loginSchema = z.object({
  email: z.string().email('Email invalid format'),
  password: z.string().min(6, 'Password must be longer than 6 characters'),
});

exports.validateWithZod = (schema) => (req, res, next) => {
  try {
    console.log('Middleware: ValidateWithZod');
    schema.parse(req.body);
    next();
  } catch (error) {
    const errMsg = error.errors.map((item) => item.message);
    const errTxt = errMsg.join(', ');
    const mergeError = new Error(errTxt);
    next(mergeError);
  }
};
