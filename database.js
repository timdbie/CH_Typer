const mariadb = require('mariadb');

const connection = mariadb.createPool({
    host: 'localhost', 
    user:'root', 
    password: '',
    database: 'db_timpietyper'
});

connection.getConnection()

if (connection) {
    console.log('Connection successful!')
} 

module.exports = connection;   