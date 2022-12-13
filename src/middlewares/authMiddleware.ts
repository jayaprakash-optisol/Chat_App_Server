import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';
import Logging from '../library/Logging';
import User from '../models/user-model';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decodedToken: any = jwt.verify(token, config.jwt.secret);
      req.user = await User.findById(decodedToken?.id).select('-password');

      next();
    } catch (error) {
      Logging.error('Not Authorized token failed');
      res.status(401).json({ message: 'Not Authorized token failed' });
    }
  }
  if (!token) {
    Logging.error('Authorization failed no token');
    res.status(401).json({ message: 'Authorization failed no token' });
  }
};
