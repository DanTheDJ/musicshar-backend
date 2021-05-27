'use strict';
const {
  Model, Sequelize
} = require('sequelize');

const PROTECTED_ATTRIBUTES = [];

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    toJson()
    {

      // hide protected fields
      let attributes = Object.assign({}, this.get())
      for (let a of PROTECTED_ATTRIBUTES) {
        delete attributes[a]
      }
      return attributes

    }

  };
  Room.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};