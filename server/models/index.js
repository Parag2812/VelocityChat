import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import configData from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configData[env];

const sequelize = new Sequelize(config.url, config);
const db = {};

// Read all model files (excluding this index file)
const files = fs.readdirSync(__dirname).filter(file => file !== 'index.js' && file.slice(-3) === '.js');

for (const file of files) {
  const modelModule = await import(path.join(__dirname, file));
  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  // Use model.name if available, otherwise fallback to the filename (capitalized)
  const modelName = model.name || path.basename(file, '.js');
  db[modelName] = model;
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
