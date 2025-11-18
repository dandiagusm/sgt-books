const { query } = require("../config/database");
const Joi = require("joi");

const memberSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{8,15}$/).required(),
  address: Joi.string().required()
});

exports.createMember = async ({ name, email, phone, address }) => {
  const { error } = memberSchema.validate({ name, email, phone, address });
  if (error) {
    const err = new Error(error.details[0].message);
    err.status = 400;
    throw err;
  }

  const exists = await query(`SELECT id FROM members WHERE email=$1`, [email]);
  if (exists.rowCount > 0) {
    const err = new Error("Email already registered");
    err.status = 400;
    throw err;
  }

  const result = await query(
    `
    INSERT INTO members (name, email, phone, address)
    VALUES ($1,$2,$3,$4)
    RETURNING id, name, email, phone, address, created_at
    `,
    [name, email, phone, address]
  );

  return result.rows[0];
};

exports.getBorrowingHistory = async ({ memberId, status, page = 1, limit = 10 }) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const offset = (page - 1) * limit;
  let params = [memberId];
  let conditions = [`b.member_id = $1`];

  if (status) {
    params.push(status);
    conditions.push(`b.status = $${params.length}`);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;

  const totalRes = await query(
    `SELECT COUNT(*) AS total FROM borrowings b ${where}`,
    params
  );

  const total = Number(totalRes.rows[0].total);

  params.push(limit, offset);

  const rows = await query(
    `
    SELECT 
      b.id, b.member_id, b.borrow_date, b.return_date, b.status,
      bk.title, bk.author, bk.isbn
    FROM borrowings b
    JOIN books bk ON bk.id = b.book_id
    ${where}
    ORDER BY b.borrow_date DESC
    LIMIT $${params.length - 1}
    OFFSET $${params.length}
    `,
    params
  );

  return {
    data: rows.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

exports.getAllMembers = async ({ page = 1, limit = 10 }) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const offset = (page - 1) * limit;

  // Count total
  const count = await query(`SELECT COUNT (*) AS total FROM members`);
  const total = Number(count.rows[0].total);

  // Fetch list
  const rows = await query(
    `
    SELECT 
      id, name, email, phone, address, created_at
    FROM members
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  return {
    data: rows.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};