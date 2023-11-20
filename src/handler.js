const { nanoid } = require("nanoid");
const books = require('./books')


// POST : /books
const addBookHandler = (request, h) => {
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
    // const bookId = books.map(books => {
    //     return {
    //         id: books.id
    //     }
    // })

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
    // let filteredBooks = books.filter((book) => (book.bookId).length > 0);
    // let mappedBooks = books.map(rawBook => ({
    //         ...rawBook,
    //         id: rawBook.bookId,
    //         name: rawBook.name,
    //         publisher: rawBook.publisher
    // }));

    const { name, reading, finished } = request.query; 

    let filteredBooks = books;
    // filteredBooks.filter(book => book.finished === (finished === 1))

    if(filteredBooks.length === 0 ) {
        const response = h.response({
            status: "success",
            data: {
                books: []
            }
        });

        return response;
    }

    const response = h.response({
        status: "success",
        data: {
            books: filteredBooks.map(rawBook => ({
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

    if(bookIndex !== -1) {
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

    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan"
    }).code(404);

    return response;
}

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookByIdHandler
};