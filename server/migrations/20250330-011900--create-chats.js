export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Messages', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.fn('gen_random_uuid'),
      primaryKey: true,
    },
    chatId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'Chats', key: 'id' },
      onDelete: 'CASCADE',
    },
    senderPhone: {
      type: Sequelize.STRING,
      allowNull: false,
      references: { model: 'Users', key: 'phoneNumber' },
      onDelete: 'CASCADE',
    },
    messageText: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()'),
    },
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('Messages');
};
