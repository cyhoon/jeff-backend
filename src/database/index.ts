import 'reflect-metadata';
import { createConnection, ConnectionOptions } from 'typeorm';

const {
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

const connectDatabase = async () => {
  try {
    const options: ConnectionOptions = {
      type: 'mysql',
      host: DATABASE_HOST,
      port: 3306,
      username: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      entities: [
        __dirname + '/entity/*{.ts,.js}',
      ],
      timezone: 'Asia/Seoul',
      extra: { max: 2, min: 1 },
      synchronize: true,
      logging: true,
    };

    await createConnection(options);
  } catch (error) {
    throw error;
  }
};

export default connectDatabase;
