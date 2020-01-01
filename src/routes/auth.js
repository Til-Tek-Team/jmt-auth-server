const app = module.exports = require('express')();

const userController = require('../controllers/user.controller');

app.post('/login', userController.login);

app.post('/signup', userController.signUp);