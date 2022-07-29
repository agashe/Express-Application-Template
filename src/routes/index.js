const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');
const UserController = require('../controllers/UserController');

router.get('/books', BookController.getAll);
router.get('/books/:id', BookController.getById);
router.post('/books', BookController.create);
router.put('/books/:id', BookController.update);
router.delete('/books/:id', BookController.destroy);

router.post('/register', UserController.register);
router.post('/login', UserController.login);

module.exports = router;