const {mModel, Datatype} = require('sequlize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: Datatype.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    comment_text: {
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
    },
    post_id: {
      type: Datatype.INTEGER,
      references: {
        model: 'post',
        key: 'id',
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
  }
);

module.exports = Comment;