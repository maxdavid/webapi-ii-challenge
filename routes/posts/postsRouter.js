const router = require('express').Router();
const db = require('../../data/db');

// GET /api/posts
router.get('/', (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'The posts information could not be retrieved.' });
    });
});

// POST /api/posts
router.post('/', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({ message: 'Please provide title and contents for the post.' });
  } else {
    db.insert(req.body)
      .then(postId => {
        res.status(201).json(db.findById(postId));
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'error adding post' });
      });
  }
});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (post.length) res.status(200).json(post);
      else
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'The post information could not be retrieved.' });
    });
});

// DELETE /api/posts/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(post => {
      if (post) res.status(200).json(post);
      else
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
    })
    .catch(err => {
      res.status(500).json({ message: 'The post could not be removed' });
    });
});

// PUT /api/posts/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({ message: 'Please provide title and contents for the post.' });
  } else {
    db.update(id, req.body)
      .then(post => {
        if (post) res.status(200).json(post);
        else
          res.status(404).json({
            message: 'The post with the specified ID does not exist.'
          });
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: 'The post information could not be modified.' });
      });
  }
});

// COMMENTS ----------------------

// GET /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
  const { id } = req.params;
  db.findById(id).then(post => {
    if (!post.length)
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    else
      db.findPostComments(id)
        .then(comments => {
          if (comments) res.status(200).json(comments);
          else
            res.status(404).json({
              message: 'The post with the specified ID does not exist.'
            });
        })
        .catch(err => {
          res.status(500).json({
            message: 'The comments information could not be retrieved.'
          });
        });
  });
});

// POST /api/posts/:id/comments
router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  if (!req.body.text) {
    res.status(400).json({ message: 'Please provide text for the comment.' });
  } else {
    db.findById(id).then(post => {
      if (!post)
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      else
        db.insertComment({ post_id: id, text: req.body.text })
          .then(comment => {
            db.findCommentById(comment.id).then(comment =>
              res.status(201).json(comment)
            );
          })
          .catch(err => {
            res.status(500).json({
              message:
                'There was an error while saving the comment to the database'
            });
          });
    });
  }
});

module.exports = router;
