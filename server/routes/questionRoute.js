const express = require("express");
const router = express.Router();
const authHeader = require("../MiddleWare/authMiddleware");
const {
  allQuestions,
  postQuestion,
  singleQuestion
} = require("../controller/questionController");
router.get("/all-questions", authHeader, allQuestions);
router.post("/post-question", authHeader, postQuestion);
router.get("/:question_id", authHeader, singleQuestion);
module.exports = router;
