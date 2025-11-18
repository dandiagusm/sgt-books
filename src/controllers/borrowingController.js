const borrowingService = require("../services/borrowingService");

exports.createBorrowing = async (req, res, next) => {
  try {
    const { book_id, member_id } = req.body;

    const result = await borrowingService.createBorrowing({
      book_id,
      member_id,
    });

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.returnBook = async (req, res, next) => {
  try {
    const borrowingId = req.params.id;

    const result = await borrowingService.returnBook(borrowingId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
