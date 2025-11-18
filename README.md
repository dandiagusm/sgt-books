# Library API — Node.js + Express + PostgreSQL

## Indexing
```
CREATE INDEX idx_books_title_lower ON books (LOWER(title));
CREATE INDEX idx_books_author_lower ON books (LOWER(author));
CREATE INDEX idx_borrowings_member_status ON borrowings (member_id, status);
CREATE INDEX idx_borrowings_member_date ON borrowings (member_id, borrow_date DESC);
CREATE INDEX idx_borrowings_status ON borrowings (status);
CREATE INDEX idx_borrowings_book_id ON borrowings (book_id);

```

## System Requirements

| Component | Version |
|----------|---------|
| Node.js  | ≥ 16 |
| npm      | ≥ 8 |
| PostgreSQL | ≥ 12 |

# Setup Project di Local

## Clone Repo
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo# 
```

## Install
```bash
npm install
```
## Buat / masukkan database yang akan digunakan di lokal postgress 
Sudah disediakan library_db

## make .env (copy from .env.sample)
Sesuakan dengan setup lokal (password, dll)

## Run
```bash
npm run dev
```
