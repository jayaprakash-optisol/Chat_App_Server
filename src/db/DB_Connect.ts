import mongoose from 'mongoose';
import { config } from '../config/config';
import Logging from '../library/Logging';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`,
      {
        retryWrites: true,
        w: 'majority',
      }
    );
    Logging.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    Logging.error('Error on Connecting MongoDB: ->');
    Logging.error(error);
  }
};

export default connectDB;
