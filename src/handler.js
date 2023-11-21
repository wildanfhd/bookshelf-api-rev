const { nanoid } = require("nanoid");
const books = require('./books')


// POST : /books
const addBookHandler = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading 
    } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt;

    if(!name) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        }).code(400);

        return response;
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        }).code(400);

        return response;
    }


    const newBook = {
        id, 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        finished, 
        reading, 
        insertedAt, 
        updatedAt
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(!isSuccess) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku',
        }).code(500);

        return response;
    } else {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            }
        }).code(201);

        return response;
    }
};

// GET : /books
const getAllBooksHandler = (request, h) => {
    let bookList = books;
    const { name, reading, finished } = request.query;

    // Mengecek apakah ada properti name pada query parameter
    if(name) {
        const bookWithName = bookList.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

        const response = h.response({
            status: "success",
            data: {
                books: bookWithName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            },
        }).code(200);

        return response;
    }

    // Mengecek apakah terdapat properti reading pada query parameter
    if(reading) {
        const filteredBooks = bookList.filter((book) => Number(book.reading) === Number(reading));

        const response = h.response({
            status: "success",
            data: {
                books: filteredBooks.map((buku) => ({
                    id: buku.id,
                    name: buku.name,
                    publisher: buku.publisher
                }))
            }
        }).code(200);

        return response;
    }

    // Mengecek terdapat properi finished apakah pada query parameter
    if(finished) {
        const finishedBooks = bookList.filter((book) => Number(book.finished) === Number(finished));

        const response = h.response({
            status: "success",
            data: {
                books: finishedBooks.map((finishedBook) => ({
                    id: finishedBook.id,
                    name: finishedBook.name,
                    publisher: finishedBook.publisher
                }))
            }
        }).code(200);

        return response;
    }

    const response = h.response({
        status: "success",
        data: {
            books: bookList.map(rawBook => ({
                id: rawBook.id,
                name: rawBook.name,
                publisher: rawBook.publisher
            }))
        },
    }).code(200);

    return response;
};

// GET : /books/{bookId}
const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((b) => b.id === id)[0];

    if(book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            }
        }).code(200);

        return response;
    };

    const response = h.response({
        status: 'fail', 
        message: 'Buku tidak ditemukan',
    }).code(404);

    return response;
    
};

// PUT : /books/{bookId}
const updateBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const updatedAt = new Date().toISOString();
    const bookIndex = books.findIndex((book) => book.id === id);

    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading 
    } = request.payload;

    // Jika client tidak melampirkan nama buku pada saat mengupdate, maka update gagal
    if(!name) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        }).code(400);

        return response;
    }

    // Jika client melampirkan readPage > pageCount pada saat mengupdate, maka update gagal
    if(readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400);

        return response;
    }

    if(bookIndex === -1) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        }).code(404);
        
        return response;
    }

    books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary, 
        publisher,
        pageCount,
        readPage, 
        reading,
        updatedAt
    }
    
    const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui"
    }).code(200);

    return response;
}

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const bookIndex = books.findIndex((book) => book.id === id);

    if(bookIndex === -1) {
        const response = h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan",
        }).code(404);

        return response;
    }

    books.splice(bookIndex, 1);
    const response = h.response({
        status: "success",
        message: "Buku berhasil dihapus",
    }).code(200);

    return response;
}

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler
};