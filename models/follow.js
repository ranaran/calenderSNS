'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Follow = loader.database.define(
  'follows',
  {
    followId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    follow: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    followed: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['follow']
      }
    ]
  }
);

module.exports = Follow;