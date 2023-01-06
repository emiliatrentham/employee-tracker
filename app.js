// Dependencies
const db = require("./db/connection");
const inquirer = require('inquirer');

require('console.table');

const promptConfig = {
    VIEW_DEPARTMENTS: 'View All Departments',
    VIEW_ROLES: 'View All Roles',
    VIEW_EMPLOYEES: 'View All Employees',
    VIEW_EMPLOYEES_BY_DEPARTMENT: 'View All Employees By Department',
    ADD_DEPARTMENT: 'Add A New Department',
    ADD_ROLE: 'Add A New Role',
    ADD_EMPLOYEE: 'Add A New Employee',
    UPDATE_ROLE: 'Update An Employee Role',
    EXIT: 'Exit Employee Tracker',   
    };
    
// Initialize server after establishing db connection
db.connect();
init();

// Initial command line prompt
function init() {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'Welcome to the Employee Tracker! What would you like to do?',
        choices: [promptConfig.VIEW_DEPARTMENTS,
                  promptConfig.VIEW_ROLES,
                  promptConfig.VIEW_EMPLOYEES,
                  promptConfig.VIEW_EMPLOYEES_BY_DEPARTMENT,
                  promptConfig.ADD_ROLE,
                  promptConfig.ADD_DEPARTMENT,
                  promptConfig.ADD_EMPLOYEE,
                  promptConfig.UPDATE_ROLE,
                  promptConfig.EXIT],
        pageSize: 9
    }]).then(({ prompt }) => {
        console.log("This is the prompt:", prompt);
        switch (prompt) {
        case promptConfig.VIEW_DEPARTMENTS:
            viewDepartments();
            break;
        case promptConfig.VIEW_ROLES:
            viewRoles();
            break;
        case promptConfig.VIEW_EMPLOYEES:
            viewEmployees();
            break;
        case promptConfig.VIEW_EMPLOYEES_BY_DEPARTMENT:
            viewEmployeesByDepartment();
            break;
        case promptConfig.ADD_DEPARTMENT:
            addDepartment();
            break;
        case promptConfig.ADD_ROLE:
            addRole();
            break;
        case promptConfig.ADD_EMPLOYEE:
            addEmployee();
            break;
        case promptConfig.UPDATE_ROLE:
            updateEmployeeRole();
                break;
        case promptConfig.EXIT:
                db.end();
                console.log('Bye');
                break; 
    }
  })
}

// VIEW FUNCTIONS
const viewDepartments = () => {
    var query = `SELECT department.name AS department_name,
                        department.id AS department_id
                 FROM department`
     
    db.query(query, (err, result) => {
        if (err) throw err;
        console.table(result);
        init();
    });
}

 const viewRoles = () => {
     var query = `SELECT role.title AS job_title,
                         role.id AS role_id,
                         department.name AS department,
                         role.salary
                  FROM role       
                  LEFT JOIN department ON role.department_id = department.id`
     
     db.query(query, (err, result) => {
        if (err) throw err;
        console.table(result);
        init();
    });
 }

 const viewEmployees = () => {
     var query = `SELECT employee.id,
                         employee.first_name,
                         employee.last_name,
                         role.title,
                         department.name AS department,
                         role.salary,
                         CONCAT (manager.first_name, " ", manager.last_name) AS manager     
                    FROM employee
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id
                    LEFT JOIN employee manager ON employee.manager_id = manager.id`
     
     db.query(query, (err, result) => {
        if (err) throw err;
        console.table(result);
        init();
    });
 }

// VIEW BY FUNCTION
const viewEmployeesByDepartment = () => {
    var query = `SELECT employee.first_name, 
                        employee.last_name, 
                        department.name AS department
                FROM employee 
                LEFT JOIN role ON employee.role_id = role.id 
                LEFT JOIN department ON role.department_id = department.id`;
    
    db.query(query, (err, rows) => {
            if (err) throw err;
            console.table(rows);
            init();
    });
}

// ADD FUNCTIONS
const addDepartment = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'department',
        message: 'What is the name of the new department?',
        validate: dept => {
            if (dept) {
                return true;
            } else {
                console.log('Please add a new department!');
                return false;
            }
        }
    }]).then((answers) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
            if (err) throw err;
            console.log(`New "${answers.department}" department added to the database.`)
            init();
        });
    })
}

const addRole = () => {
    var query = `SELECT * FROM department`
    db.query(query, (err, result) => {
        if (err) throw err;

        inquirer.prompt([{
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?',
            validate: role => {
                if (role) {
                    return true;
                } else {
                    console.log('Please add a new role!');
                    return false;
                }
            }
        },
        {
            // Add salary
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the new role?',
            validate: salary => {
                if (salary) {
                    return true;
                } else {
                    console.log('Please add a new salary!');
                    return false;
                }
            }
        },
        {
            // Add new role department
            type: 'list',
            name: 'department',
            message: 'Which department does the new role belong to?',
            choices: () => {
                var array = [];
                for (var i = 0; i < result.length; i++) {
                    array.push(result[i].name);
                }
                return array;
            }
        }

        ]).then((answers) => {
            for (var i = 0; i < result.length; i++) {
                if (result[i].name === answers.department) {
                    var department = result[i];
                }
            }
            
            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.title, answers.salary, department.id], (err, result) => {
                if (err) throw err;
                console.log(`${answers.title} added to the database.`)
                init();
            
            });
        })
    });
} 

const addEmployee = () => {
    var query = `SELECT * FROM role`;
    db.query(query, (err, result) => {
        if (err) throw err;

        const roles = result

        var managerQuery = `SELECT * FROM employee WHERE role_id = 1`

        db.query(managerQuery, (err, managerResult) => {
            const managers = managerResult

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the new employee\'s first name?',
                    validate: firstName => {
                        if (firstName) {
                            return true;
                        } else {
                            console.log('Please add a first name!');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the new employee\'s last name?',
                    validate: lastName => {
                        if (lastName) {
                            return true;
                        } else {
                            console.log('Please a last name!');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the new employee\'s role?',
                    choices: () => roles.map(role => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    })
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'What is the name of the new employee\'s manager?',
                    choices: () => managers.map(manager => {
                        return {
                            name: `${manager.first_name} ${manager.last_name}`,
                            value: manager.id
                        }
                    }),
                  
                }
            
            ]).then((answers) => {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].title === answers.role) {
                        var role = result[i];
                    }
                }
    
               
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, answers.role, answers.manager], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                    init();
                });
            })
        })

        
    });
}



// UPDATE FUNCTION
const updateEmployeeRole = () => {
    var query = `SELECT * FROM role`
    db.query(query, (err, result) => {
        if (err) throw err; 0

        const roles = result

        var employeeQuery = `SELECT * FROM employee`

        db.query(employeeQuery, (err, employeeResult) => {
            const employees = employeeResult

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee\'s role do you want to update?',
                    choices: () => employees.map(role => {
                        return {
                            name: `${role.first_name} ${role.last_name}`,
                            value: `${role.first_name} ${role.last_name}`
                        }
                    })
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the new role?',
                    choices: () => roles.map(role => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    })
                }
            ]).then((answers) => {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].last_name === answers.employee) {
                        var name = result[i];
                    }
                }

                for (var i = 0; i < result.length; i++) {
                    if (result[i].title === answers.role) {
                        var role = result[i];
                    }
                }

                db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [name, role], (err, result) => {
                    if (err) throw err;
                    console.log(`Updated ${answers.employee}'s role to the database.`)
                    init();
                });
            })
        });
    })
}
