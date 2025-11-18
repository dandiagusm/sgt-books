const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

// GET /api/members
router.get("/", memberController.getAllMembers);

// POST /api/members
router.post("/", memberController.createMember);

// GET /api/members/:id/borrowings
router.get("/:id/borrowings", memberController.getBorrowingHistory);

module.exports = router;
