const { query } = require("../config/database");
const Joi = require("joi");

// Validation schema for member input
const memberSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
});

exports.createMember = async ({ name, email, phone, address }) => {
  // Validate body
  const { error } = memberSchema.validate({ name, email, phone, address });
  if (error) throw new Error(error.details[0].message);

  // Check duplicate email
  const emailCheck = await query("SELECT * FROM members WHERE email = $1", [
    email,
  ]);

  if (emailCheck.rowCount > 0) {
    const err = new Error("Email already registered");
    err.status = 400;
    throw err;
  }

  const result = await query(
    `
    INSERT INTO members (name, email, phone, address)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [name, email, phone, address]
  );

  return result.rows[0];
};

exports.getBorrowingHistory = async ({
  memberId,
  status,
  page = 1,
  limit = 10,
}) => {
  const offset = (page - 1) * limit;

  let conditions = [`b.member_id = $1`];
  let params = [memberId];

  if (status) {
    params.push(status);
    conditions.push(`b.status = $${params.length}`);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  // Count total data
  const totalRes = await query(
    `SELECT COUNT(*) AS total FROM borrowings b ${whereClause}`,
    params
  );

  const total = parseInt(totalRes.rows[0].total);

  // Add limit & offset
  params.push(limit, offset);

  const history = await query(
    `
    SELECT 
      b.id AS borrowing_id,
      b.borrow_date,
      b.return_date,
      b.status,
      bk.title,
      bk.author,
      bk.isbn
    FROM borrowings b
    JOIN books bk ON bk.id = b.book_id
    ${whereClause}
    ORDER BY b.borrow_date DESC
    LIMIT $${params.length - 1}
    OFFSET $${params.length}
  `,
    params
  );

  return {
    data: history.rows,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};
