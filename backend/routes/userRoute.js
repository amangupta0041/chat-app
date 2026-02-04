import express from "express";
// Import all controller functions here
import { getOtherUsers, login, logout, register } from "../controllers/userController.js";
// Import only the authentication middleware here
// Note: Changed "middlewares" to "middleware" to match your file explorer
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// The middleware checks if you are logged in, 
// then the controller gets the users.
router.route("/").get(isAuthenticated, getOtherUsers);

export default router;