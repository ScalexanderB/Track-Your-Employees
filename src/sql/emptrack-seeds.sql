USE company;

INSERT INTO employee (firstname, lastname) VALUES ('Charles','Tucker');

INSERT INTO employee (firstname, lastname, manageryn) VALUES ('Jasmine','Smith', 'Y');

INSERT INTO department (name) VALUES ('Marketing');

INSERT INTO role (title, salary) VALUES ('Digital Marketer', 60,000.00),('Marketing Manager', 90,000.00);

UPDATE employee SET role_id=(select id from role where title = 'Marketing Manager') where employee.firstname = 'Jasmine' and employee.lastname = 'Smith';

UPDATE role SET department_id=(select id from department where name = 'Marketing') where title in ('Digital Marketer','Marketing Manager');

UPDATE employee SET role_id=(select id from role where title = 'Digital Marketer'), manager_id=2 where employee.firstname = 'Charles' and employee.lastname = 'Tucker';