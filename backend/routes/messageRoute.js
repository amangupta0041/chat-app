import express from "express";
import { getMessage, sendMessage, deleteMessage, getUnreadCounts, deleteConversation } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/unread").get(isAuthenticated, getUnreadCounts);
router.route("/send/:id").post(isAuthenticated,sendMessage);
router.route("/:id").get(isAuthenticated, getMessage);
router.route("/delete/:id").delete(isAuthenticated, deleteMessage);
router.route("/conversation/:id").delete(isAuthenticated, deleteConversation);

export default router;