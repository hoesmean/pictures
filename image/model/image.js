const Sequelize = require('sequelize');
const table = require('../db/db');

const Image = table.define('Image', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    buffer: Sequelize.BLOB,
    userName: Sequelize.STRING,
    
});

    module.exports = Image;