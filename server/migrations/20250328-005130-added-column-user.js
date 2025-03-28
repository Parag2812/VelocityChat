// /home/roscom/Desktop/VelocityChat/server/migrations/20250328-005130-added-column-user.js
export async function up(queryInterface, Sequelize) {
  try {
    await Promise.all([
      queryInterface.addColumn('Users', 'avatarUrl', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'city', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'country', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      // REMOVE THIS ENTIRE BLOCK AS phoneNumber ALREADY EXISTS
      // queryInterface.addColumn('Users', 'phoneNumber', {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   unique: true,
      // }),
    ]);
  } catch (error) {
    console.error('Error during migration up:', error);
    throw error; // Re-throw the error to potentially stop the migration process
  }
}

export async function down(queryInterface, Sequelize) {
  try {
    await Promise.all([
      queryInterface.removeColumn('Users', 'avatarUrl'),
      queryInterface.removeColumn('Users', 'city'),
      queryInterface.removeColumn('Users', 'country'),
      // REMOVE THIS ENTIRE BLOCK AS phoneNumber WAS ADDED IN THE FIRST MIGRATION
      // queryInterface.removeColumn('Users', 'phoneNumber'),
    ]);
  } catch (error) {
    console.error('Error during migration down:', error);
    throw error; // Re-throw the error
  }
}