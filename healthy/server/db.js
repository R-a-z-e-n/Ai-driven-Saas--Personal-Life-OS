const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'razeen',
    password: '213085629@Razeen',
    database: 'mysql workbench'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = connection;