const memberService = require("../services/memberService");

exports.createMember = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;

    const result = await memberService.createMember({
      name,
      email,
      phone,
      address,
    });

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBorrowingHistory = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const { status, page, limit } = req.query;

    const result = await memberService.getBorrowingHistory({
      memberId,
      status,
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
