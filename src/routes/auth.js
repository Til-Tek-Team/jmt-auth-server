const app = (module.exports = require("express")());

const userController = require("../controllers/user.controller");

app.post("/login", userController.login);
app.post("/signup", userController.signUp);

app.post("/social_login", userController.socialLogin);
app.post("/social_signup", userController.socialSignup);

app.get("/user_name/:username", userController.getUserByUsername);
app.get("/users/:email", userController.getUser);
app.post("/resend_email",userController.resendEmail);
app.post("/application_user",userController.createApplicationUser);
// app.post('/verify_token', userController.verifyToken);

app.post("/verify_email", userController.verifyEmail);
app.get("/unverified_email", userController.getUnverifiedUser);
app.get("/unverified_email/date", userController.getUnverifiedUserDate);
// app.post('/change_password_request', userController.changePasswordRequest);

app.post("/change_password", userController.changePassword);

app.post("/set_password", userController.setPassword);

app.post("/update_password", userController.updatePassword);

app.get("/user/:email", userController.getUserByEmail);

app.post("/update_user", userController.updateUser);

app.post("/companies", userController.addCompanyProfile);

app.post("/check_username", userController.checkUsername);

app.post(
  "/create_new_application_user",
  userController.createNewApplicationUser
);
