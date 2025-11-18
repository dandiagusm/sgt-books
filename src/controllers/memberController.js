const memberService = require("../services/memberService");

exports.createMember = async (req, res, next) => {
  try {
    const result = await memberService.createMember(req.body);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
};

exports.getBorrowingHistory = async (req, res, next) => {
  try {
    const result = await memberService.getBorrowingHistory({
      memberId: req.params.id,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getAllMembers = async (req, res, next) => {
  try {
    const result = await memberService.getAllMembers({
      page: req.query.page,
      limit: req.query.limit
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};