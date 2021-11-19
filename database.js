const mariadb = require('mariadb');

const connection = mariadb.createPool({
    host: 'localhost', 
    user:'root', 
    password: 'xsJ5x#67',
    database: 'db_timpietyper'
});

connection.getConnection()

if (connection) {
    console.log('Connection successful!')
} 

module.exports = connection;   