DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE managers(
  manager_id INT NOT NULL AUTO_INCREMENT,
  manager VARCHAR(50),
  PRIMARY KEY (manager_id)
);

CREATE TABLE department(
  department_id INT NOT NULL AUTO_INCREMENT,
  department VARCHAR(30),
  PRIMARY KEY (department_id)
);

CREATE TABLE roles(
  role_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary decimal NOT NULL,
  department_id int,
  PRIMARY KEY (role_id),
  FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  department_id int,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  FOREIGN KEY (manager_id) REFERENCES managers(manager_id),
  FOREIGN KEY (department_id) REFERENCES department(department_id)
);

INSERT INTO managers(manager) VALUES ('harley quinn');

INSERT INTO managers(manager) VALUES ('hayley comet');
INSERT INTO managers(manager) VALUES ('superman');

INSERT INTO department(department) VALUES ('IT');
INSERT INTO department(department) VALUES ('marketing');

INSERT INTO roles(title, salary, department_id) VALUES ('technician', 50000, 1);
INSERT INTO roles(title, salary, department_id) VALUES ('admin', 30000, 1);
INSERT INTO roles(title, salary, department_id) VALUES ('spokesperson', 70000, 2);
INSERT INTO roles(title, salary, department_id) VALUES ('designer', 60000, 1);

INSERT INTO employee(first_name, last_name, role_id, manager_id, department_id) VALUES ('Bob', 'Marley', 1, 1, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id, department_id) VALUES ('Crystal', 'Waters', 2, 1, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id, department_id) VALUES ('Cat', 'Woman', 3, 2, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id, department_id) VALUES ('Bestal', 'Designar', 3, 2, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id, department_id) VALUES ('Worstal', 'Designar', 3, 3, 1);