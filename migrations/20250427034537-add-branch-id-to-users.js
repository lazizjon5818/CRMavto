'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'branchId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Hozircha ixtiyoriy, keyin majburiy qilish mumkin
      references: {
        model: 'branches',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'branchId');
  },
};