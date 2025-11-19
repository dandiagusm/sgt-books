# Library API 
## System Requirements
| Component | Version |
|----------|---------|
| Node.js  |  22 |
| npm      | 11 |
| PostgreSQL | ≥ 15 |
| Express.js | 5 |

## Indexing
Dilakukan indexing terhadapat querry yang sering dilakukan
```
CREATE INDEX idx_books_title_lower ON books (LOWER(title));
CREATE INDEX idx_books_author_lower ON books (LOWER(author));
CREATE INDEX idx_borrowings_member_status ON borrowings (member_id, status);
CREATE INDEX idx_borrowings_member_date ON borrowings (member_id, borrow_date DESC);
CREATE INDEX idx_borrowings_status ON borrowings (status);
CREATE INDEX idx_borrowings_book_id ON borrowings (book_id);

```

# How to run in Local
## Clone Repo
```bash
git clone https://github.com/dandiagusm/sgt-books.git
cd sgt-books
```

## Install
```bash
npm install
```

## Setup Environment Variables
Buat file .env pada root atau copy dari .env.example
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=library_db
DB_PORT=5432
```
sesuaikan db user, password, dan db name yang akan digunakan di lokal Anda.

## Create Database
```
psql -U postgres
CREATE DATABASE library_db;
```

## Import sql scheme and sample data
```
psql -U postgres -d library_db -f sql/schema.sql
psql -U postgres -d library_db -f sql/sample_data.sql
psql -U postgres -d library_db -f sql/index.sql
```

## Run the server
```bash
npm run dev
```
Server beralan di
```
http://localhost:3000
```

# API Documentation
Links : [Postman Public Collection](https://documenter.getpostman.com/view/9425838/2sB3Wwry44) 
or get the file from docs/ and import the collection to Postman.
It includes:
- GET /api/books
- POST /api/members
- POST /api/borrowings
- PUT /api/borrowings/:id/return
- GET /api/members/:id/borrowings