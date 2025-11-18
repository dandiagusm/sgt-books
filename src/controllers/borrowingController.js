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
