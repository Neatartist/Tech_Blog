const router = require('express').router();
const sequelize = require('../config/connection');
const withAuth = require('../../utils/auth');

// get all comments
router.get('/', (req, res) => {
    console.log(req.session);
    Comment.findAll({
        attributes: [
            'id',
            'comment_text',
            'user_id',
            'post_id',
            'created_at'
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: user,
                attributes: ['username']
            }
        ]
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// create comment
router.post('/', withAuth, (req, res) => {
    // check session
    if(req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            // use id from session
            user_id: req.session.user_id,
            post_id: req.body.post_id
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    }
});


// delete comment
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        // if no comment found
        if(!dbCommentData) {
            res.status(404).json({message: 'No comment found with this id'});
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});


module.exports = router;

