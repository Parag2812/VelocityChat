// models/User.js
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false, 
      unique: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,  
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,  
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,  
    },

  }, {
    tableName: 'Users',
    timestamps: true,  
  });
  
  return User;
};
