const express = require('express');

const projectRouter = require('./projects/projectRouter');

const server = express();
server.use(express.json());

server.use('/projects', projectRouter);

server.get('/', (req, res) => {
    res.send("It's alive!")
})

module.exports = server;