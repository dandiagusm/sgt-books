const { query } = require("../config/database");

exports.getAllBooks = async ({ title, author, page = 1, limit = 10 }) => {
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

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Count total rows
  const countResult = await query(
    `SELECT COUNT(*) AS total FROM books ${whereClause}`,
    params
  );

  const total = parseInt(countResult.rows[0].total);

  // Fetch result data
  params.push(limit, offset);

  const booksResult = await query(
    `
    SELECT 
      id, title, author, published_year, stock, isbn,
      CASE WHEN stock > 0 THEN true ELSE false END AS available
    FROM books
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${params.length - 1}
    OFFSET $${params.length}
    `,
    params
  );

  return {
    data: booksResult.rows,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};
