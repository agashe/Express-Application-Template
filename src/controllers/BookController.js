const BookService = require('../services/BookService');
var validator = require('validator');
var jwt = require('jsonwebtoken');
require('dotenv').config();

class BookController {
    constructor () {}

    async getAll(req, res) {
        if (
            !req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer') ||
            !req.headers.authorization.split(' ')[1]
        ) {
            return res.status(422).json({
                status: "0",
                message: "Please provide auth token",
            });
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            const verified = jwt.verify(token, process.env.SECRET_TOKEN);

            if (!verified.id) {
                return res.status(403).json({
                    status: "0",
                    message: "Unauthorized",
                });
            }
        } catch (e) {
            res.status(400).send({
                status: "0",
                message: e.message
            });
        }

        const books = await BookService.getAll();
        res.json(books);
    }

    async getById(req, res) {
        const book = await BookService.getById(req.params.id);
        res.json(book);
    }

    async create(req, res) {
        if (!req.body.name) {
            return res.status(401).send({
                status: "0",
                message: "Missing book name"
            });
        }

        if (!req.body.pages) {
            return res.status(401).send({
                status: "0",
                message: "Missing book pages"
            });
        }

        if (!validator.isNumeric(req.body.pages)) {
            return res.status(401).send({
                status: "0",
                message: "Invalid pages format"
            });
        }

        if (!req.body.author) {
            return res.status(401).send({
                status: "0",
                message: "Missing book author"
            });
        }

        if (!req.body.publishedAt) {
            return res.status(401).send({
                status: "0",
                message: "Missing book publish date"
            });
        }

        if (!validator.isDate(req.body.publishedAt, {format: 'YYYY-M-D'})) {
            return res.status(401).send({
                status: "0",
                message: "Invalid publish date"
            });
        }

        try {
            await BookService.create({
                name: req.body.name,
                pages: req.body.pages,
                author: req.body.author, 
                publishedAt: req.body.publishedAt, 
            });

            res.json({
                status: "1",
                message: "book was created successfully"
            });
        } catch (e) {
            res.status(400).send({
                status: "0",
                message: e.message
            });
        }
    }

    async update(req, res) {
        let data = {};
        
        if (req.body.name != '')
            data.name = req.body.name;
        if (req.body.pages != '')
            data.pages = req.body.pages;
        if (req.body.author != '')
            data.author = req.body.author;
        if (req.body.publishedAt != '')
            data.publishedAt = req.body.publishedAt;
        
        try {
            await BookService.update(req.params.id, data);

            res.json({
                status: "1",
                message: "book was updated successfully"
            });
        } catch (e) {
            res.status(400).send({
                status: "0",
                message: e.message
            });
        }
    }

    async destroy(req, res) {
        try {
            await BookService.destroy(req.params.id);

            res.json({
                status: "1",
                message: "book was deleted successfully"
            });
        } catch (e) {
            res.status(400).send({
                status: "0",
                message: e.message
            });
        }
    }
}

module.exports = new BookController();
