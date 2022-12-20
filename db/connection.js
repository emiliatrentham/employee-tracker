const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);
  
module.exports = db;
  
// inquirer part set up interface fr when we star the app 
// depending on what user picks use mysql package to query rows 
// look at activities 21 and 22 db.query

