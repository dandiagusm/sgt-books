const { getClient } = require("../config/database");

exports.createBorrowing = async ({ book_id, member_id }) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const book = await client.query("SELECT stock FROM books WHERE id=$1", [book_id]);
    if (book.rowCount === 0) throw new Error("Book not found");
    if (book.rows[0].stock <= 0) throw new Error("Book is out of stock");

    const count = await client.query(
      `SELECT COUNT(*) AS total FROM borrowings WHERE member_id=$1 AND status='BORROWED'`,
      [member_id]
    );
    if (Number(count.rows[0].total) >= 3)
      throw new Error("Member has reached max borrowing limit");

    const result = await client.query(
      `
      INSERT INTO borrowings (book_id, member_id, borrow_date)
      VALUES ($1,$2,CURRENT_DATE)
      RETURNING *
      `,
      [book_id, member_id]
    );

    await client.query("UPDATE books SET stock = stock - 1 WHERE id=$1", [book_id]);

    await client.query("COMMIT");
    return result.rows[0];
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

exports.returnBook = async (id) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const borrow = await client.query(`SELECT * FROM borrowings WHERE id=$1`, [id]);
    if (borrow.rowCount === 0) throw new Error("Borrowing record not found");
    if (borrow.rows[0].status === "RETURNED") throw new Error("Book already returned");

    const bookId = borrow.rows[0].book_id;

    await client.query("UPDATE books SET stock = stock + 1 WHERE id=$1", [bookId]);

    const result = await client.query(
      `
      UPDATE borrowings
      SET status='RETURNED', return_date=CURRENT_DATE
      WHERE id=$1
      RETURNING *
      `,
      [id]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

exports.getAllBorrowings = async ({ page = 1, limit = 10 }) => {
  const client = await getClient();

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const offset = (page - 1) * limit;

  try {
    // Count
    const count = await client.query(`SELECT COUNT(*) AS total FROM borrowings`);
    const total = Number(count.rows[0].total);

    // Data
    const rows = await client.query(
      `
        SELECT id, book_id
        FROM borrowings
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
        totalPages: Math.ceil(total / limit),
      },
    };

  } finally {
    client.release(); // release connection
  }
};