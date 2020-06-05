const express = require('express');
const projectsRouter = require('./projectsRouter');
const actionsRouter = require('./actionsRouter');

const server = express();

server.use(express.json());
server.use('/projects', projectsRouter);
server.use('/actions', actionsRouter);


server.get('/', (req, res,) => {
    res.send(`word`);
    
  });
  
  module.exports = server;