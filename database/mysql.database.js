const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'edutrack'
});

connection.connect((err)=>{
    err?console.log("connection failed"):console.log("connected with database")
})

module.exports = connection;


//A student can take multiple courses
//Likewise, many students can take the same course