# Library API Design

Resource: **books**

## Endpoints

### 1. List all books
- **Method:** GET
- **Path:** `/books`
- **Description:** Returns all books in the library.
- **Success status:** 200 OK

### 2. Get one book
- **Method:** GET
- **Path:** `/books/{id}`
- **Description:** Returns the book with the given id.
- **Success status:** 200 OK

### 3. Create a book
- **Method:** POST
- **Path:** `/books`
- **Description:** Adds a new book.
- **Request body:**
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1958
  }
- **Success status:** 201 Created

### 4. Update a book
- **Method:** PUT
- **Path:** `/books/{id}`
- **Description:** Replaces the details of an existing book.
- **Request body:**
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1959
  }
- **Success status:** 200 OK

### 5. Delete a book
- **Method:** DELETE
- **Path:** `/books/{id}`
- **Description:** Removes a book.
- **Success status:** 204 No Content

### 6. List books by author
- **Method:** GET
- **Path:** `/books?author=Chinua Achebe`
- **Description:** Returns only books by that author (query parameter).
- **Success status:** 200 OK

## Error codes

- **400 Bad Request** - The request is invalid.
  Example: POST `/books` with no `title`, or with `year` set to "abc".
- **404 Not Found** - The book does not exist.
  Example: GET `/books/9999` when no book has id 9999.