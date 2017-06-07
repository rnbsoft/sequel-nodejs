"use strict"

// model definition
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("user", {
    firstname: {
      field: "firstname",
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      field: "lastname",
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      field: "username",
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      field: "password",
      type: DataTypes.STRING
    },
  }, {
    freezeTableName: false 
  })
}