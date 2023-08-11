const {post, user, Comment} = require('../models');
const router = require('express').router();
const sequelize = require('../config/connection');

router.get('/', (req, res) => {
    console.log(req.session);
    post.findAll({
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    'id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at'
                ],
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
    .then(dbPostData => {
        // pass a single post object into the homepage template
        const posts = dbPostData.map(post => post.get({plain: true}));
        res.render('homepage', {posts, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// login route
router.get('/login', (req, res) => {
    // if user is logged in, redirect to homepage
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// get single post
router.get('/post/:id', (req, res) => {
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
                model: Comment,
                attributes: [
                    'id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at'
                ],
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
    .then(dbPostData => {
        // if no post by that id, return an error
        if(!dbPostData) {
            res.status(404).json({message: 'No post found'});
            return;
        }
        // serialize the data
        const post = dbPostData.get({plain: true});
        // pass data to template
        res.render('single-post', {post, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;