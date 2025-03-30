import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    "username": "postgres",
    "password": "mysecretpassword",
    "database": "mydevdb",
    "host": "127.0.0.1",
    "dialect": "postgres",
    dialectOptions: {
      ssl: false,
    },
  },
  
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      preferQueryMode: 'simple',
      connectionTimeoutMillis: 60000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  }
};
