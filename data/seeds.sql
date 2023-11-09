INSERT INTO department (names)
VALUES ("Engineer"),
       ("Finance"),
       ("Sales"),
       ("Legal");

INSERT INTO roles (title, salary, department)
VALUES ("Civil Engineer", 120000, 1),
       ("Software Engineer", 70000, 1),
       ("UX Designer", 80000, 1),
       ("UI Market Design", 95000, 3),
       ("Criminal Defense Lawyer", 200000, 4),
       ("Hardware Engineer", 65000, 1),
       ("Web Developer", 40000, 1),
       ("Account Management", 55000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Harry", "Potter", 8, NULL),
       ("Draco", "Malfoy", 6, 1),
       ("Albus", "Dumbeldore", 7, 1),
       ("Severus", "Snape", 3, 1),
       ("Ron", "Weasley", 2, 1),
       ("Hermione", "Granger", 6, NULL),
       ("Sirius", "Black", 5, NULL),
       ("Tom", "Riddle", 4, NULL),
       ("Hagrid", "N/A", 1, NULL);