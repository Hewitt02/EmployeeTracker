const inquirer = require('inquirer');
const mysql = require('mysql2');

// Creating a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'grootroot',
    database: 'business_db'
});

// Connecting to the database
db.connect((error) => {
    if (error) {
        console.log('Error connecting to the MySQL Database');
        return;
    }
});

// Event listener for database errors
db.on("error", (err) => {
    // Handle database errors here
});

// Function to display the main menu
function MainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Please select an option.',
                choices: ["View All Departments", "View All Roles", "View All Employees", "Add Role", "Add Employee", "Update Employee Role", "Add Department", "Quit"],
                name: 'Main page',
            }])
        .then(answer => {
            switch (answer['Main page']) {
                case 'View All Departments':
                    viewDepartment();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmployee();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Update Employee Role':
                    Promodemo();
                    break;
                case 'Quit':
                    db.end();
                    break;
            }
        });
}

// Function to view all departments
function viewDepartment() {
    let query = "SELECT * FROM department";
    db.query(query, function (err, res) {
        if (err) throw err;
        console.table(res); // Display results in a table
        MainMenu();
    });
}

// Function to view all roles
function viewRoles() {
    let query = "SELECT roles.title, roles.salary, department.names FROM roles LEFT JOIN department ON roles.department = department.id";
    db.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        MainMenu();
    });
}

// Function to view all employees
function viewEmployee() {
    const query = `SELECT employee.id, employee.first_name AS "first name", employee.last_name 
                    AS "last name", roles.title, department.names AS department, roles.salary, 
                    concat(manager.first_name, " ", manager.last_name) AS manager
                    FROM employee
                    LEFT JOIN roles
                    ON employee.role_id = roles.id
                    LEFT JOIN department
                    ON roles.department = department.id
                    LEFT JOIN employee manager
                    ON manager.id = employee.manager_id`;
    db.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        MainMenu();
    });
}

// Function to add an employee
function addEmployee() {
    db.query("SELECT id AS value, title AS name FROM roles", function (err, res) {
        let roles = res;
        db.query("SELECT id AS value, concat(first_name, ' ', last_name) AS name FROM employee", function (err, res) {
            let managers = res;
            managers = [{ value: null, name: "No manager" }, ...managers];
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What's the first name of the employee?",
                        name: "FirstName"
                    },
                    {
                        type: "input",
                        message: "What's the last name of the employee?",
                        name: "LastName"
                    },
                    {
                        type: "list",
                        message: "What is the employee's role id number?",
                        choices: roles,
                        name: "roleID"
                    },
                    {
                        type: "list",
                        message: "What is the manager id number?",
                        choices: managers,
                        name: "managerID"
                    }
                ])
                .then(function (answer) {
                    let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                    db.query(query, [answer.FirstName, answer.LastName, answer.roleID, answer.managerID], function (err, res) {
                        if (err) throw err;
                        console.log("Employee added successfully!");
                        MainMenu();
                    });
                });
        });
    });
}

// Function to add a role
function addRole() {
    db.query("SELECT id AS value, names AS name FROM department", function (err, res) {
        let department = res;
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What's the name of the new role?",
                    name: "Title"
                },
                {
                    type: "input",
                    message: "What's the salary for the position?",
                    name: "Salary"
                },
                {
                    type: "list",
                    message: "What department will it be under?",
                    choices: department,
                    name: "Department"
                },
            ])
            .then(function (answer) {
                let query = "INSERT INTO roles (title, salary, department) VALUES (?, ?, ?)";
                db.query(query, [answer.Title, answer.Salary, answer.Department], function (err, res) {
                    if (err) throw err;
                    console.log("Role added successfully!");
                    MainMenu();
                });
            });
    });
}

// Function to add a department
function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What's the name of the department?",
                name: "names"
            },
        ])
        .then(function (answer) {
            let query = "INSERT INTO department (names) VALUES (?)";
            db.query(query, [answer.names], function (err, res) {
                if (err) throw err;
                console.log("Department added successfully!");
                MainMenu();
            });
        });
}

// Function to update employee roles
function Promodemo() {
    db.query("SELECT id AS value, title AS name FROM roles", function (err, res) {
        let roles = res;
        db.query("SELECT id AS value, concat(first_name, ' ', last_name) AS name FROM employee", function (err, res) {
            let employee = res;
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "What's is employee changing roles",
                        choices: employee,
                        name: "name"
                    },
                    {
                        type: "list",
                        message: "What's is the employee new role?",
                        choices: roles,
                        name: "role"
                    },
                ])
                .then(function (answer) {
                    let query = "Update employee set role_id=? where id=?";
                    db.query(query, [answer.role, answer.name], function (err, res) {
                        if (err) throw err;
                        console.log("Role updated successfully!");
                        MainMenu();
                    });
                });
        });
    });
}

// Start the application by calling the main menu function
MainMenu();
