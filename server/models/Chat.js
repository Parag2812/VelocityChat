export default (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', { 
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      participantOne: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'phoneNumber',
        },
        onDelete: 'CASCADE',
      },
      participantTwo: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'phoneNumber',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()'),
      },
    });
  
    // Associations must be added after all models are initialized
    Chat.associate = (models) => {
      if (!models.User || !models.Message) {
        console.error('🚨 User or Message model is not loaded properly!');
        return;
      }
      Chat.belongsTo(models.User, { foreignKey: 'participantOne', as: 'UserOne' });
      Chat.belongsTo(models.User, { foreignKey: 'participantTwo', as: 'UserTwo' });
      Chat.hasMany(models.Message, { foreignKey: 'chatId', as: 'messages' });
    };
  
    return Chat;
  };
  