const router = require('express').Router();
const {post, user, comment} = require('../../models');
const withAuth = requre('../../utils/auth.js');
const sequelize = require('sequelize');

// get all posts
router.get('/', (req, res) => {
    console.log('=======================');
    post.findAll({
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: user,
                    attributes: ['username']
                }
            },
            {
                model: user,
                attributes: ['username']
            }
        ]
    })
    // return all posts
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// get single post
router.get('/:id', (req, res) => {
    post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [
            {
                model: comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: user,
                    attributes: ['username']
                }
            },
            {
                model: user,
                attributes: ['username']
            }
        ]
    })
    // return single post
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// create post
router.post('/', withAuth, (req, res) => {
    post.create({
        title: req.body.title,
        content: req.body.content,
        // use id from session
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    })
});

// update post
router.put('/:id', withAuth, (req, res) => {
    post.update(
      {
        title: req.body.title,
        content: req.body.content
      },
      {
          where: {
            id: req.params.id
          }
      }
  )
  // return updated post
  .then(dbPostData => {
      if(!dbPostData) {
        res.status(404).json({message: 'No post found with this id'});
        return;
      }
      res.json(dbPostData);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// delete post

router.delete('/:id', withAuth, (req, res) => {
  post.destroy({
    where: {
      id: req.params.id
    }
  })
    // return deleted post
  .then(dbPostData => {
    if(!dbPostData) {
      res.status(404).json({message: 'No post found with this id'});
        return;
      }
      res.json(dbPostData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;