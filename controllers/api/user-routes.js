const router = require('express').Router();
const {user, comment, post} = require('../../models');
const withAuth = requrie('../../utils/auth.js');

// routes api users
router.get('/', (req, res) => {
  // access user model and run .findAll() method
  user.findAll({
      attributes: {exclude: ['password']}
  })
  // return user data
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  })
});

// get single user
router.get('/:id', (req, res) => {
  user.findOne({
      attributes: {exclude: ['password']},
      where: {
          id: req.params.id
      },
      include: [
          {
              model: post,
              attributes: ['id', 'title', 'content', 'created_at']
          },
          {
              model: comment,
              attributes: ['id', 'comment_text', 'created_at'],
              include: {
                  model: post,
                  attributes: ['title']
              }
          }
      ]
  })
  // return user data
  .then(dbUserData => {
      if(!dbUserData) {
          res.status(404).json({message: 'No user found with this id'});
          return;
      }
      res.json(dbUserData);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  })
});

// create user

router.post('/', (req, res) => {
  // expects {username: 'username', password: 'password1234'}
  user.create({
      username: req.body.username,
      password: req.body.password
  })
  // store user data during session
  .then(dbUserData => {
      req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          // send response
          res.json(dbUserData);
      })
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  })
});

// login route

router.post('/login', (req, res) => {
  // expects {username: 'username', password: 'password1234'}
  user.findOne({
      where: {
          username: req.body.username
      }
  })
  .then(dbUserData => {
      // if username not found
      if(!dbUserData) {
          res.status(400).json({message: 'No user with that username'});
          return;
      }
      // verify user
      const validPassword = dbUserData.checkPassword(req.body.password);
      // if password is invalid
      if(!validPassword) {
          res.status(400).json({message: 'Incorrect password'});
          return;
      }
      // if valid, save session
      req.session.save(() => {
          // declare session variables
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
          // send response
          res.json({user: dbUserData, message: 'You are now logged in'});
      })
  })
});

// logout route

router.post('/logout', (req, res) => {
  // if user is logged in, destroy session and clear cookies
  if(req.session.loggedIn) {
      req.session.destroy(() => {
          res.status(204).end();
      })
  }
  else {
      res.status(404).end();
  }
});

// update user

router.put('/:id', withAuth, (req, res) => {
  // expects {username: 'username', password: 'password1234'}
  user.update(req.body, {
      individualHooks: true,
      where: {
          id: req.params.id
      }
  })
  .then(dbUserData => {
      if(!dbUserData[0]) {
          res.status(404).json({message: 'No user found with this id'});
          return;
      }
      res.json(dbUserData);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  })
});

// delete user

router.delete('/:id', withAuth, (req, res) => {
  user.destroy({
      where: {
          id: req.params.id
      }
  })
  .then(dbUserData => {
      if(!dbUserData) {
          res.status(404).json({message: 'No user found with this id'});
          return;
      }
      res.json(dbUserData);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  })
});

module.exports = router;

