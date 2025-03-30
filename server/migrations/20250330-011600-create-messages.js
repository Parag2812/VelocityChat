export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Chats', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.fn('gen_random_uuid'),
      primaryKey: true,
    },
    participantOne: {
      type: Sequelize.STRING,
      allowNull: false,
      references: { model: 'Users', key: 'phoneNumber' },
      onDelete: 'CASCADE',
    },
    participantTwo: {
      type: Sequelize.STRING,
      allowNull: false,
      references: { model: 'Users', key: 'phoneNumber' },
      onDelete: 'CASCADE',
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
  await queryInterface.dropTable('Chats');
};
