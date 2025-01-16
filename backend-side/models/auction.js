'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Auction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Auction.hasMany(models.Transaction, { foreignKey: "auction_id", as: "transactions" })
    }
  }
  Auction.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name is required'
        },
        notNull: {
          msg: 'Name is required'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Price is required'
        },
        notNull: {
          msg: 'Price is required'
        }
      }
    },
    img: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Image is required'
        },
        notNull: {
          msg: 'Image is required'
        }
      }
    },
    is_sold: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_id: DataTypes.INTEGER,
    updated_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Auction',
  });
  return Auction;
};