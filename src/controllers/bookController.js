const bookService = require("../services/bookService");

exports.getAllBooks = async (req, res, next) => {
  try {
    const result = await bookService.getAllBooks({
      title: req.query.title,
      author: req.query.author,
      page: req.query.page,
      limit: req.query.limit
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};
