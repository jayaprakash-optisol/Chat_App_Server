import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export const generateToken = async (id: any) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};
