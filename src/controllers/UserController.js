const UserService = require('../services/UserService');
var validator = require('validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();

class UserController {
    constructor () {}

    async register(req, res) {
        if (!req.body.name) {
            return res.status(401).send({
                status: "0",
                message: "Missing name"
            });
        }

        if (!req.body.email) {
            return res.status(401).send({
                status: "0",
                message: "Missing email"
            });
        }

        if (!validator.isEmail(req.body.email)) {
            return res.status(401).send({
                status: "0",
                message: "Invalid email"
            });
        }

        if (!req.body.password) {
            return res.status(401).send({
                status: "0",
                message: "Missing password"
            });
        }

        if (req.body.password.length < 8) {
            return res.status(401).send({
                status: "0",
                message: "Password length should be at least 8 chars"
            });
        }

        const user = await UserService.getByEmail(req.body.email);

        if (user) {
            return res.status(401).send({
                status: "0",
                message: "This email is already registered"
            });
        }

        try {
            let password = await bcrypt.hash(req.body.password, 10);

            const userId = await UserService.create({
                name: req.body.name,
                email: req.body.email,
                password: password, 
            });

            var token = jwt.sign({ id: userId }, process.env.SECRET_TOKEN);

            res.json({
                status: "1",
                message: "Registered successfully",
                token: token
            });
        } catch (e) {
            res.status(400).send({
                status: "0",
                message: e.message
            });
        }
    }

    async login(req, res) {
        if (!req.body.email) {
            return res.status(401).send({
                status: "0",
                message: "Email or password is incorrect"
            });
        }

        if (!validator.isEmail(req.body.email)) {
            return res.status(401).send({
                status: "0",
                message: "Email or password is incorrect"
            });
        }

        if (!req.body.password) {
            return res.status(401).send({
                status: "0",
                message: "Email or password is incorrect"
            });
        }

        const user = await UserService.getByEmail(req.body.email);

        if (!user) {
            return res.status(401).send({
                status: "0",
                message: "This email isn't registered on our database"
            });
        }

        let checkPassword = await bcrypt.compare(req.body.password, user.password);

        if (!checkPassword) {
            return res.status(401).send({
                status: "0",
                message: "Email or password is incorrect"
            });
        }

        var token = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN);

        try {
            res.json({
                status: "1",
                message: "Logged in successfully",
                token: token
            });
        } catch (e) {
            res.status(400).send({
                status: "0",
                message: e.message
            });
        }
    }
}

module.exports = new UserController();
