var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "pega!Sus123",
  database: "employee_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

var chosenDepartment = "";
var chosenRole = "";
var chosenManager = "";

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "startMenu",
      type: "list",
      message: "What would you like to do?",
      choices: ["View all Employees By Department", "View all Employees By Manager", "Add Employee",
        "Remove Employee", "Update Employee Role", "Update Employee Manager", "View All Roles", "Utilised Budgets", "End"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.startMenu === "View all Employees By Department") {
        viewDepartments();
      }
      else if (answer.startMenu === "View all Employees By Manager") {
        viewByManager();
      } else if (answer.startMenu === "Add Employee") {
        addEmployee();
      } else if (answer.startMenu === "Remove Employee") {
        removeEmployee();
      } else if (answer.startMenu === "Update Employee Role") {
        updateEmployee();
      } else if (answer.startMenu === "Update Employee Manager") {
        updateManager();
      } else if (answer.startMenu === "View All Roles") {
        viewAll();
      } else if (answer.startMenu === "Utilised Budgets") {
        utilisedBudgets();
      }
      else {
        connection.end();
      }
    });
}
var joiningQuery = "SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.department, department.department_id, managers.manager, managers.manager_id";
joiningQuery += " FROM employee";
joiningQuery += " INNER JOIN roles ON employee.role_id=roles.role_id";
joiningQuery += " INNER JOIN department ON employee.department_id = department.department_id";
joiningQuery += " INNER JOIN managers ON employee.manager_id = managers.manager_id";

var allDepartments = [];
function utilisedBudgets() {
  connection.query("Select department, department_id From department",
  function (err, result) {
    result.forEach(element => allDepartments.push(element.department + " " + element.department_id))
    
    inquirer
  .prompt({
    name: "department",
    type: "list",
    message: "Department: ",
    choices: allDepartments
  })
  .then(function(answer){
    var answered = answer.department;
    var stringAnswered = answered.split(" ");
    var id = stringAnswered[1];

    connection.query("SELECT SUM(salary) FROM roles WHERE department_id = ?",
    id,
      function (err, result) {
        if (err) throw err;
        console.table(result);
        start();
      }
    );
  })
  }
);
}

function viewDepartments() {
  connection.query(
    joiningQuery + " ORDER By department_id;",
    function (err, result) {
      if (err) throw err;
      console.table(result, ["first_name", "last_name", "title", "salary", "department"]);
      start();
    }
  );
}

function viewAll() {
  connection.query("Select * from roles",
    function (err, result) {
      if (err) throw err;
      console.table(result, ["role_id", "title", "salary"]);
      start();
    }
  );
}

function viewByManager() {
  connection.query(
    joiningQuery + " ORDER By manager_id;",
    function (err, result) {
      if (err) throw err;
      console.table(result, ["first_name", "last_name", "manager", "title", "salary", "department"]);
      start();
    }
  );
}

function addEmployee() {
  var rolesAvailable = [];
  var departmentsAvailable = [];
  var managersAvailable = [];

  connection.query("Select title From roles",
    function (err, result) {
      result.forEach(element => rolesAvailable.push(element.title))
  
    }
  );

  connection.query("Select manager From managers",
    function (err, result) {
      result.forEach(element => managersAvailable.push(element.manager))
 
    }
  );

  connection.query("Select department From department",
    function (err, result) {
      result.forEach(element => departmentsAvailable.push(element.department))
      
    }
  );

  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "First Name: "
      },
      {
        name: "last_name",
        type: "input",
        message: "Last Name: "
      },
      {
        name: "manager",
        type: "list",
        message: "Manager: ",
        choices: managersAvailable
      },
      {
        name: "title",
        type: "list",
        message: "Role: ",
        choices: rolesAvailable
      },
      {
        name: "department",
        type: "list",
        message: "Department: ",
        choices: departmentsAvailable
      }
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "Select * From roles where title= ?",
        answer.title,
        function (err, result) {
          chosenRole = result[0].role_id;
          connection.query(
            "Select * From department where department= ?",
            answer.department,
            function (err, result) {
              chosenDepartment = result[0].department_id;
              connection.query(
                "Select * From managers where manager= ?",
                answer.manager,
                function (err, result) {
                  chosenManager = result[0].manager_id;

                  connection.query(
                    "INSERT INTO employee SET ?",
                    {
                      first_name: answer.first_name,
                      last_name: answer.last_name,
                      role_id: chosenRole,
                      manager_id: chosenManager,
                      department_id: chosenDepartment
                    },
                    function (err, result) {
                      if (err) throw err;
                      console.log("Successfully added!" + '\n');
                      // re-prompt the user for if they want to bid or post
                      start();
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
}

var employees = [];
function removeEmployee() {
  connection.query("Select first_name, last_name, id From employee",
    function (err, result) {
      result.forEach(element => employees.push(element.first_name + " " + element.last_name + " " + element.id))
      inquirer
        .prompt(
          {
            name: "employee",
            type: "list",
            message: "Which Employee To Remove: ",
            choices: employees
          }
        )
        .then(function (answer) {
          var answered = answer.employee;
          var stringAnswered = answered.split(" ");
          var firstName = stringAnswered[0];
          var id = stringAnswered[3];
          connection.query("DELETE FROM employee WHERE first_name = ? AND id = ?",
            [firstName, id],
            function (err, result) {
              if (err) throw err;
              console.log("Employee removed successfully!" + '\n');
            })
        });
    }
  );
}

function updateEmployee() {
  var rolesAvailable = [];
  var id = "";
  var roleid = "";

  connection.query("Select title, role_id From roles",
    function (err, result) {
      result.forEach(element => rolesAvailable.push(element.title + " " + element.role_id))
    }
  );
  connection.query("Select first_name, last_name, id From employee",
    function (err, result) {
      result.forEach(element => employees.push(element.first_name + " " + element.last_name + " " + element.id))
      inquirer
        .prompt(
          {
            name: "employee",
            type: "list",
            message: "Which Employee To Update: ",
            choices: employees
          }
        )
        .then(function (answer) {
          var answered = answer.employee;
          var stringAnswered = answered.split(" ");
          var firstName = stringAnswered[0];
          id = stringAnswered[2];
          console.log(id);

          inquirer
            .prompt(
              {
                name: "roles",
                type: "list",
                message: "Which Role To Update To: ",
                choices: rolesAvailable
              }
            )
            .then(function (answer) {
              var roleChosen = answer.roles;
              var chosenString = roleChosen.split(" ");
              roleid = chosenString[1];

              connection.query("Update employee SET role_id = ? WHERE id = ?",
                [roleid, id],
                function (err, result) {
                  if (err) throw err;
                  console.log("Employee updated successfully!" + '\n');
                  start();
                })
            });
        });
    }
  );
}


function updateManager() {
  var managersAvailable = [];
  var id = "";
  var roleid = "";

  connection.query("Select manager, manager_id From managers",
    function (err, result) {
      result.forEach(element => managersAvailable.push(element.manager + " " + element.manager_id))
    }
  );
  connection.query("Select first_name, last_name, id From employee",
    function (err, result) {
      result.forEach(element => employees.push(element.first_name + " " + element.last_name + " " + element.id))
      inquirer
        .prompt(
          {
            name: "employee",
            type: "list",
            message: "Which Employee To Update: ",
            choices: employees
          }
        )
        .then(function (answer) {
          var answered = answer.employee;
          var stringAnswered = answered.split(" ");
          var firstName = stringAnswered[0];
          id = stringAnswered[2];

          inquirer
            .prompt(
              {
                name: "manager",
                type: "list",
                message: "New Manager: ",
                choices: managersAvailable
              }
            )
            .then(function (answer) {
              var managerChosen = answer.manager;
              console.log(managerChosen);
              var chosenString = managerChosen.split(" ");
              console.log(chosenString);
              managerid = chosenString[2];

              connection.query("Update employee SET manager_id = ? WHERE id = ?",
                [managerid, id],
                function (err, result) {
                  if (err) throw err;
                  console.log("Employee's manager updated successfully!" + '\n');
                  start();
                })
            });
        });
    }
  );
}
