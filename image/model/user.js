const Sequelize = require('sequelize');
const table = require('../db/db');

const User = table.define('User', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    imgPath: Sequelize.STRING,
    image: Sequelize.STRING
    
});
    module.exports = User;