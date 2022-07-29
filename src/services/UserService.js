const sequelize = require('./db');
const { DataTypes } = require('sequelize');
const User = require('../models/user')(sequelize, DataTypes);

class UserService {
    constructor () {}

    async getAll() {
        const users = await User.findAll();
        return users;
    }

    async getById(id) {
        const user = await User.findByPk(id);
        return user;
    }
    
    async getByEmail(email) {
        const user = await User.findOne({
            where: { email: email } 
        });
        
        return user;
    }

    async create(data) {
        const user = await User.create(data);
        return user.id ? user.id : false;
    }

    async update(id, data) {
        const user = await User.update(data, {
            where: {
                id: id
            }
        });
        
        return user.id ? true : false;
    }

    async destroy(id) {
        const user = await User.destroy({
            where: {
                id: id
            }
        });

        return !user.id ? true : false;
    }
}

module.exports = new UserService();