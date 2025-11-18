const bookService = require("../services/bookService");

exports.getAllBooks = async (req, res, next) => {
  try {
    const { title, author, page, limit } = req.query;

    const result = await bookService.getAllBooks({
      title,
      author,
      page,
      limit,
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
