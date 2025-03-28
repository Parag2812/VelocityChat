// server/migrations/20250329-010000-test-column.js
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'testColumn', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
  
  export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'testColumn');
  }