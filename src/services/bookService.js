const { query } = require("../config/database");

exports.getAllBooks = async ({ title, author, page = 1, limit = 10 }) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  let conditions = [];
  let params = [];

  if (title) {
    params.push(`%${title}%`);
    conditions.push(`LOWER(title) LIKE LOWER($${params.length})`);
  }

  if (author) {
    params.push(`%${author}%`);
    conditions.push(`LOWER(author) LIKE LOWER($${params.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const totalRes = await query(`SELECT COUNT(*) AS total FROM books ${where}`, params);
  const total = Number(totalRes.rows[0].total);

  params.push(limit, offset);

  const rows = await query(
    `
    SELECT id, title, author, published_year, stock, isbn,
    (stock > 0) AS available
    FROM books
    ${where}
    ORDER BY created_at DESC
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
