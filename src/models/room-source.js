'use strict';
const {
  Model, Sequelize
} = require('sequelize');

const PROTECTED_ATTRIBUTES = [];

module.exports = (sequelize, DataTypes) => {
  class RoomSource extends Model {
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
  RoomSource.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    type: {
      type: DataTypes.STRING
    },
    data: {
      type: DataTypes.JSON
    }
  }, {
    sequelize,
    modelName: 'RoomSource',
  });

  RoomSource.associate = function(models) {

    // Room.belongsTo(models.User, {as: 'ownerUser'});
    // Room.belongsTo(models.RoomSource, {as: 'roomSource'});

  };

  return RoomSource;
};