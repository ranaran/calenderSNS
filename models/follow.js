'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Follow = loader.database.define(
  'follows',
  {
    follow: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false
    },
    followed: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false
    },
    followname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    followedname: {
      type: Sequelize.STRING,
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