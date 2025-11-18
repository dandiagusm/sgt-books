const express = require("express");
const router = express.Router();
const borrowingController = require("../controllers/borrowingController");

// GET /api/borrowings
router.get("/", borrowingController.getAllBorrowings);

// POST /api/borrowings
router.post("/", borrowingController.createBorrowing);

// PUT /api/borrowings/:id/return
router.put("/:id/return", borrowingController.returnBook);

module.exports = router;
