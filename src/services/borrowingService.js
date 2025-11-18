const { getClient, query } = require("../config/database");

exports.createBorrowing = async ({ book_id, member_id }) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    // Check stock
    const book = await client.query("SELECT stock FROM books WHERE id = $1", [
      book_id,
    ]);

    if (book.rowCount === 0) throw new Error("Book not found");
    if (book.rows[0].stock <= 0) throw new Error("Book is out of stock");

    // Check member borrow limit
    const countBorrow = await client.query(
      `
      SELECT COUNT(*) AS total
      FROM borrowings
      WHERE member_id = $1 AND status = 'BORROWED'
      `,
      [member_id]
    );

    if (parseInt(countBorrow.rows[0].total) >= 3)
      throw new Error("Member has reached max 3 active borrowings");

    // Insert borrowing
    const borrowResult = await client.query(
      `
      INSERT INTO borrowings (book_id, member_id, borrow_date)
      VALUES ($1, $2, CURRENT_DATE)
      RETURNING *
      `,
      [book_id, member_id]
    );

    // Decrease stock
    await client.query(
      `
      UPDATE books
      SET stock = stock - 1
      WHERE id = $1
      `,
      [book_id]
    );

    await client.query("COMMIT");

    return borrowResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

exports.returnBook = async (borrowingId) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    // Check record
    const borrow = await client.query(
      `SELECT * FROM borrowings WHERE id = $1`,
      [borrowingId]
    );

    if (borrow.rowCount === 0) throw new Error("Borrowing record not found");
    if (borrow.rows[0].status === "RETURNED")
      throw new Error("Book already returned");

    const bookId = borrow.rows[0].book_id;

    // Update stock
    await client.query(
      `
      UPDATE books
      SET stock = stock + 1
      WHERE id = $1
      `,
      [bookId]
    );

    // Update borrowing record
    const result = await client.query(
      `
      UPDATE borrowings
      SET status = 'RETURNED',
          return_date = CURRENT_DATE
      WHERE id = $1
      RETURNING *
      `,
      [borrowingId]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
