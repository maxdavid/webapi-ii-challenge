const express = require('express');
// const cors = require('cors');
const db = require('./data/db');

const postsRouter = require('./routes/posts/postsRouter.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json('hello');
});

server.use('/api/posts', postsRouter);
// server.use(cors());

const port = process.env.PORT || 8000;
server.listen(port, () => console.log('server running'));
