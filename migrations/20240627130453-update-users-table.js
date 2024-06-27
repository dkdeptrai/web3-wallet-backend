"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "email", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    });
    await queryInterface.changeColumn("Users", "username", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    });
    await queryInterface.removeColumn("Users", "password");
    await queryInterface.addColumn("Users", "publicAddress", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "email", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("Users", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.removeColumn("Users", "publicAddress");
  },
};
