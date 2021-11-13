// Database connection
const connection = require('../config/config');
// Query var
const queries = require('./queries');
// Output for making the tables
const consoleTable = require('console.table');
// Inquire
const inquirer = require("inquirer");
// Action list
const actionsList = require('./actionsList');
// Allows use of promises for connection.query
const util = require("util");
const { deepStrictEqual } = require('assert');
const query = util.promisify(connection.query).bind(connection);

// Initializing function
const start = () => {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What option would you like to select?",
            choices: actionsList.actionsList
        })
        .then((answer) => {
            if(answer.action === 'Exit') {
                exitProgram();
            } else {
                switch (answer.action) {
                    // View all the employees
                    case actionsList.actionsList[0]:
                        viewAllEmployeesQ();
                        break;

                    // View all the departments
                    case actionsList.actionsList[1]:
                        viewAllDeptsQ();
                        break;

                    // View all the roles
                    case actionsList.actionsList[2]:
                        viewAllRolesQ();
                        break;
                    
                    // Add an employee 
                    case actionsList.actionsList[3]:
                        addEmployeeQ();
                        break;
                    
                    // Add department
                    case actionsList.actionsList[4]:
                        addDepartmentQ();
                        break;

                    // Add a role
                    case actionsList.actionsList[5]:
                        addRoleQ();
                        break;

                    // Update an employees role
                    case actionsList.actionsList[6]:
                        updateEmployeeRoleQ();
                        break;

                    // Update an employees manager
                    case actionsList.actionsList[7]:
                        updateEmployeeMgrQ();
                        break;

                    // View employees by manager
                    case actionsList.actionsList[8]:
                        viewEmployeesByManagerQ();
                        break;

                    // View utilized budget
                    case actionsList.actionsList[9]:
                        viewUtilizedBudgetQ();
                        break;

                    // Delete Employee
                    case actionsList.actionsList[10]:
                        deleteEmployeeQ();
                        break;

                    // Delete role
                    case actionsList.actionsList[11]:
                        deleteRoleQ();
                        break;

                    // Delete department
                    case actionsList.actionsList[12]:
                        deleteDepartmentQ();
                        break;
                }
            }
        });
}

// GET functionality
// Roles
const getRoles = () => {
    return query(queries.viewAllRoles);
}
// Employees
const getEmployees = () => {
    return query(queries.viewAllEmployees);
}
// Departments
const getDepartments = () => {
    return query(queries.viewAllDepartments);
}
// Managers
const getManagers = () => {
    return query(queries.viewAllManagers);
}

// VIEW functionality
// View all employees
const viewAllEmployeesQ = async () => {
    try {
        const rows = await getEmployees();
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

// View all departments
const viewAllDeptsQ = async () => {
    try {
        const rows = await getDepartments();
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

// View all roles
const viewAllRolesQ = async () => {
    try {
        const rows = await getRoles();
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

// View employees by manager
const viewEmployeesByManagerQ = async () => {
    try {
        const rows = await query(queries.viewEmployeesByManager);
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

// View utilized budget
const viewUtilizedBudgetQ = async () => {
    try {
        const rows = await query(queries.viewUtilizedBudget);
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

// ADD functionality
// Add an employee
const addEmployeeQ = async () => {
    try {
        // define questions
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "empFirstName",
                        type: "input",
                        message: "Enter a first name for your new employee.",
                    },
                    {
                        name: "empLastName",
                        type: "input",
                        message: "Enter a last name for your new employee.",
                    },
                    {
                        name: "empManagerYN",
                        type: "rawlist",
                        message: "Is this new employee a manager? Select Y for Yes or N for No.",
                        choices: ["Y", "N"]
                    },
                    {
                        name: "empRoleId",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            roles.forEach((role) => {
                                const roleObj = {
                                    name: role.title,
                                    value: role.id
                                }
                                choiceArray.push(roleObj)
                            })
                            return choiceArray;
                        },
                        message: "Choose a role for your new employee."
                    },
                    {
                        name: "empManagerId",
                        typr: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            managers.forEach((mgr) => {
                                const mgrObj = {
                                    name: mgr.name,
                                    value: mgr.id
                                }
                                choiceArray.push(mgrObj)
                            })
                            return choiceArray;
                        },
                        message: "Choose a manger for the new employee."
                    }
                ])
                .then((answer) => {
                    connection.query(
                            queries.addEmployee,
                            {
                                firstname: answer.empFirstName,
                                lastname: answer.empLastName,
                                role_id: answer.empRoleId,
                                manager_id: answer.empManagerId,
                                manageryn: answer.empManagerYN
                            },
                            (err) => {
                                if (err) throw err;
                                console.log(`Your new employee ${answer.empFirstName} ${answer.empLastName} was added successfully!`);
                                start();
                            });
                    });
        }

        // await
        const roles = await getRoles();
        const managers = await getManagers();
        await promptUser();
    } catch (err) {
        console.log(err);
    }
}

// Add a department
const addDepartmentQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "deptName",
                        type: "input",
                        message: "Enter a name for your new department."
                    }
                ])
                .then((answer) => {
                    connection.query(
                        queries.addDepartment,
                        {
                            name: answer.deptName
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`Your new department ${answer.deptName} was added successfully!`);
                            start();
                        });
                });
        }

        //await
        await promptUser();
    } catch (err) {
        console.log(err);
    }
}

// Add a role
const addRoleQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
            .prompt([
                {
                    name: "roleTitle",
                    type: "input",
                    message: "Enter a name for your new role.",
                },
                {
                    name: "roleSalary",
                    type: "input",
                    message: "Enter a salary for your new role."
                },
                {
                    name: "roleDeptId",
                    type: "rawlist",
                    choices: function () {
                        const choiceArray = [];
                        depts.forEach((dept) => {
                            const deptObj = {
                                name: dept.department_name,
                                value: dept.id 
                            }
                            choiceArray.push(deptObj)
                        })
                        return choiceArray;
                    },
                    message: "Choose a department for the new role."
                }
            ])
            .then((answer) => {
                connection.query(
                    queries.addRole,
                    {
                        title: answer.roleTitle,
                        salary: answer.roleSalary,
                        department_id: answer.roleDeptId
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`Your new role ${answer.roleTitle} was added successfully!`);
                    });
            });
        }

        // await
        const depts = await getDepartments();
        await promptUser();
    } catch (err) {
        console.log(err);
    }
}

// Update functionality
// Update the role
const updateEmployeeRoleQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "empID",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            emps.forEach((emp) => {
                                const empObj = {
                                    name: `${emp.firstName} ${emp.lastname}`,
                                    value: emp.id
                                }
                                choiceArray.push(empObj)
                            })
                            return choiceArray;
                        },
                        message: "Choose an employee whose role you'd like to update."
                    },
                    {
                        name: "empRoleId",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            roles.forEach((role) => {
                                const roleObj = {
                                    name: role.title,
                                    value: role.id
                                }
                                choiceArray.push(roleObj)
                            })
                            return choiceArray;
                        },
                        message: "Choose a new role for your employee."
                    }
                ])
                .then((answer) => {
                    connection.query(
                        queries.updateEmployee,
                        [
                            {
                                role_id: answer.empRoleId
                            },
                            {
                                id: answer.empID
                            }
                        ],
                        (err) => {
                            if (err) throw err;
                            console.log(`Your employees role has been updated successfully!`);
                            start();
                        });
                });
        }

        //await
        const emps = await getEmployees();
        const roles = await getRoles();
        await promptUser();
    } catch (err) {
        console.log(err);
    }
}

// Update the manager
const updateEmployeeMgrQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "empID",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            emps.forEach((emp) => {
                                const empObj = {
                                    name: `${emp.firstname} ${emp.lastname}`,
                                    value: emp.id
                                }
                                choiceArray.push(empObj)
                            })
                            return choiceArray;
                        },
                        message: "Choose an employee whose manager you would like to update."
                    },
                    {
                        name: "empManagerId",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            managers.forEach((mgr) => {
                                const mgrObj = {
                                    name: mgr.name,
                                    value: mgr.id
                                }
                                choiceArray.push(mgrObj)
                            })
                            return choiceArray;
                        },
                        message: "Choose a new manager for your employee."
                    }
                ])
                .then((answer) => {
                    connection.query(
                        queries.updateEmployee,
                        [
                            {
                                manager_id: answer.empManagerId
                            },
                            {
                                id: answer.empID
                            }
                        ],
                        (err) => {
                            if (err) throw err;
                            console.log(`Your employees manager was updated successfully!`);
                            start();
                        });
                });
        }

        // await
        const emps = await getEmployees();
        const managers = await getManagers();
        await promptUser();
    } catch (err) {
        console.log(err);
    }
}

// Delete functionality
// Delete employee
const deleteEmployeeQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "empID",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            emps.forEach((emp) => {
                                const empObj = {
                                    name: `${emp.firstname} ${emp.lastname}`,
                                    value: emp.id
                                }
                                choiceArray.push(empObj)
                            })
                            return choiceArray;
                        },
                        message: "Choose an employee you would like to delete."
                    }
                ])
                .then((answer) => {
                    connection.query(
                        queries.deleteEmployee,
                        {
                            id:answer.empID
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`Your employee was deleted successfully!`);
                            start();
                        });
                });
        }

        // await
        const emps = await getEmployees();
        await promptUser();
    } catch (err) {
        console.log(err);
    }
}

// Delete a role
const deleteRoleQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "roleID",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            roles.forEach((role) => {
                                const roleObj = {
                                    name: role.title,
                                    value: role.id
                                }
                                choiceArray.push(roleObj)
                            })
                            return choiceArray;
                        },
                        message: "Choose the role you would like to delete.",
                    }
                ])
                .then((answer) => {
                    connection.query(
                        queries.deleteRole,
                        {
                            id: answer.roleID 
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`Your role was deleted successfully!`);
                            start();
                        });
                });
        }

        // await
        const roles = await getRoles();
        await promptUser();
    } catch (err) {
        console.log(err);
    }
}

// Delete department
const deleteDepartmentQ = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "deptID",
                        type: "rawlist",
                        choices: function() {
                            const choiceArray = [];
                            depts.forEach((dept) => {
                                const deptObj = {
                                    name: dept.department_name,
                                    value: dept.id
                                }
                                choiceArray.push(deptObj)
                            })
                            return choiceArray;
                        },
                        message: "Choose which role you would like to delete.",     
                    }
                ])
                .then((answer) => {
                    connection.query(
                        queries.deleteDepartment,
                        {
                            id: answer.deptID 
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`The department was deleted successfully!`);
                            start();
                        });
                });
        }

        //await
        const depts = await getDepartments();
        await promptUser();
    } catch (err) {
        console.log(err);
    }
}

// Exit the program
const exitProgram = () => {
    console.log("Goodbye!")
    return connection.end();
}

module.exports = { start }