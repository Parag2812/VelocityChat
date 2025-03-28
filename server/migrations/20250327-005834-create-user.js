// 'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()')
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phoneNumber: {             // New phone number column
      type: Sequelize.STRING,
      allowNull: false,        // Not null
      unique: true             // Optionally enforce uniqueness
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('NOW()')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('NOW()')
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Users');
}
