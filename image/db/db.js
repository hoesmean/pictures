const Sequelize = require('sequelize');

const sequelize = new Sequelize('cityone', 'root', 'root', {
    host: '127.0.0.1',
    dialect:'mysql',
    port:'8889' 
    
});



module.exports = sequelize;