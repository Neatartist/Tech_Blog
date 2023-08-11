const User = require('./user');
const Project = require('./post');
const Comment = require('./comment')

User.hasMany(Post, {
  foreignKey: 'user_id',
});

post.belongsTo(User, {
  foreignKey: 'user_id'
});


Comment.belongsTo(User, {
  foreignKey: 'user_id'
});


Comment.belongsTo(Post, {
  foreignKey: 'Post_id'
});


User.hasMany(Comment, {
  foreignKey: 'user_id'
});


post.hasMany(Comment, {
  foreignKey: 'Post_id'
});

module.exports = { User, Project };
