USE employee_db;
INSERT INTO department (id, name)
VALUES (1, "Sales"),
       (2, "Human Resources"),
       (3, "Marketing"),
       (4, "Accounting");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Manager", 70000, 1),
       (2, "Secretary", 50000, 2),
       (3, "Designer", 65000, 3),
       (4, "Accountant", 90000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Emilia", "Trentham", 1, NULL),
       (2, "Olivia", "Knots", 3, 1),
       (3, "Mary", "Willson", 2, 1),
       (4, "George", "Harrison", 4, 1);


