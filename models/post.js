const { Model, Datatype} = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {}

Post.init(
  {
    id: {
      type: Datatype.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Datatype.STRING,
      allowNull: false,
      validate: {
        len: [1],
      }
    },
    post_text {
      type: Datatype.STRING,
      allowNull: false,
      validate: {
        len: [1],
      }
    },
    user_id: {
      type: Datatype.INTEGER,
      references: {
        model: 'user',
        key: 'id',  
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post',
  }
);

module.exports = Post;