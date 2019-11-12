'use strict'
const uuid = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const dryness = sequelize.define(
    'dryness',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      age: DataTypes.INTEGER,
      sex: DataTypes.INTEGER,
      code: DataTypes.INTEGER,
      score: DataTypes.INTEGER
    },
    {
      underscored: true
    }
  )
  dryness.associate = function (models) {
    // associations can be defined here
  }
  dryness.beforeCreate((dryness, _) => {
    return dryness.id === uuid()
  })
  return dryness
}
