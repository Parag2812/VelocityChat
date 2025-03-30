//20250329-012000-rename-username-column.js
 
export async function up(queryInterface, Sequelize) {
  await queryInterface.renameColumn('Users', 'username', 'name');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.renameColumn('Users', 'name', 'username');
}
