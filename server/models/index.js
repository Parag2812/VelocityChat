import { Sequelize, DataTypes } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import ChatModel from './Chat.js';
import MessageModel from './Message.js';
import UserModel from './User.js';

dotenv.config();

// Resolve file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine environment
const env = process.env.NODE_ENV || 'development';

// Database configuration
const config = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'mysecretpassword',
    database: process.env.DB_NAME || 'mydevdb',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    dialectOptions: { ssl: false },
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
      preferQueryMode: 'simple',
      connectionTimeoutMillis: 60000,
    },
    pool: { max: 5, min: 0, acquire: 60000, idle: 10000 },
  },
};

// Initialize Sequelize
const sequelizeConfig = config[env];
const sequelize = sequelizeConfig.url
  ? new Sequelize(sequelizeConfig.url, sequelizeConfig)
  : new Sequelize(
      sequelizeConfig.database,
      sequelizeConfig.username,
      sequelizeConfig.password,
      sequelizeConfig
    );

// Migration setup
const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, '..', 'migrations', '*.js'),
    resolve: ({ name, path, context }) => ({
      name,
      up: async () => (await import(`file://${path}`)).up(context, Sequelize),
      down: async () => (await import(`file://${path}`)).down(context, Sequelize),
    }),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

// Function to run pending migrations
async function runMigrations() {
  try {
    console.log('Running pending migrations...');
    const pending = await umzug.pending();
    console.log('Pending migrations:', pending.map(p => p.name));

    const migrated = await umzug.up();
    if (migrated.length === 0) {
      console.log('No pending migrations.');
    } else {
      console.log('Successfully applied migrations:', migrated.map(m => m.name));
    }
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

// Initialize models
const models = {
  User: UserModel(sequelize, DataTypes),
  Chat: ChatModel(sequelize, DataTypes),
  Message: MessageModel(sequelize, DataTypes),
};

// **Make sure associations are initialized after defining models**
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// ✅ Fix: Export DataTypes
export const { User, Chat, Message } = models;
export { sequelize, runMigrations, DataTypes }; // Added DataTypes here
export default models;
