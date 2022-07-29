const sequelize = require('./db');
const { DataTypes } = require('sequelize');
const Book = require('../models/book')(sequelize, DataTypes);

class BookService {
    constructor () {}

    async getAll() {
        const books = await Book.findAll();
        return books;
    }

    async getById(id) {
        const book = await Book.findByPk(id);
        return book;
    }

    async create(data) {
        const book = await Book.create(data);
        return book.id ? true : false;
    }

    async update(id, data) {
        const book = await Book.update(data, {
            where: {
                id: id
            }
        });
        
        return book.id ? true : false;
    }

    async destroy(id) {
        const book = await Book.destroy({
            where: {
                id: id
            }
        });

        return !book.id ? true : false;
    }
}

module.exports = new BookService();