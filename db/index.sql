CREATE INDEX idx_books_title_lower ON books (LOWER(title));
CREATE INDEX idx_books_author_lower ON books (LOWER(author));
CREATE INDEX idx_borrowings_member_status ON borrowings (member_id, status);
CREATE INDEX idx_borrowings_member_date ON borrowings (member_id, borrow_date DESC);
CREATE INDEX idx_borrowings_status ON borrowings (status);
CREATE INDEX idx_borrowings_book_id ON borrowings (book_id);
