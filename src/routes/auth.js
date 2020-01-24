const app = module.exports = require('express')();

const userController = require('../controllers/user.controller');

app.post('/login', userController.login);
app.post('/signup', userController.signUp);

app.post('/social_login', userController.socialLogin);
app.post('/social_signup', userController.socialSignup);

app.get('/users/:email', userController.getUser)

// app.post('/verify_token', userController.verifyToken);

app.post('/verify_email', userController.verifyEmail);

// app.post('/change_password_request', userController.changePasswordRequest);

app.post('/change_password', userController.changePassword);

app.post('/set_password', userController.setPassword);

app.post('/update_password', userController.updatePassword)

app.get('/user/:email', userController.getUserByEmail)