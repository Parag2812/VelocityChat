import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 60000  // 60 seconds
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,  // 60 seconds
      idle: 10000
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
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
