import dotenv from 'dotenv';
dotenv.config();

const STAGE: any = process.env.STAGE || 'development';

const JWT_SECRET: any = process.env.JWT_SECRET;
const TOKEN_EXPIRESIN: any = process.env.TOKEN_EXPIRESIN;

const MONGO_DATABASE_NAME: any = process.env.MONGO_DATABASE_NAME || '';
const MONGO_HOST: any = process.env.MONGO_HOST || '';
const MONGO_PORT: any = process.env.MONGO_PORT || '';

const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 5000;

export const config = {
  stage: STAGE,

  mongo: {
    host: MONGO_HOST,
    port: parseInt(MONGO_PORT),
    database: MONGO_DATABASE_NAME,
  },
  server: {
    port: SERVER_PORT,
  },
  jwt: {
    secret: JWT_SECRET,
    expiresIn: TOKEN_EXPIRESIN,
  },
};
