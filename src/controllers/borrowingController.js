const borrowingService = require("../services/borrowingService");

exports.createBorrowing = async (req, res, next) => {
  try {
    const result = await borrowingService.createBorrowing(req.body);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
};

exports.returnBook = async (req, res, next) => {
  try {
    const result = await borrowingService.returnBook(req.params.id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

exports.getAllBorrowings = async (req, res, next) => {
  try {
    const result = await borrowingService.getAllBorrowings({
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};