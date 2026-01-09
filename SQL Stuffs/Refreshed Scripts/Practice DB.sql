/* READ THE INSTRUCTIONS FIRST!!!!

USE THE FIND AND REPLACE TOOL TO CHANGE ALL INSTANCES OF 

username

INTO YOUR

username (ex.  skelemen1)

Thereby creating a database called : skelemen1_Northwind

THEN MAKE SURE NOTHING IS SELECTED / HIGHLIGHTED.  FINALLY,
PRESS F5 TO EXECUTE THE SCRIPT.

*/


use master
go

drop database if exists [username_practice]
go
create database [username_practice]
go

use [username_practice]
go

CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    CustomerName VARCHAR(50),
    Country VARCHAR(50)
);

INSERT INTO Customers (CustomerID, CustomerName, Country) VALUES
(1, 'John Smith', 'USA'),
(2, 'Alice Brown', 'Canada'),
(3, 'Michael Johnson', 'USA'),
(4, 'Sophia Lee', 'UK'),
(5, 'David Wilson', 'India'),
(6, 'Emma Davis', 'Canada'),
(7, 'James Miller', 'Australia'),
(8, 'Olivia Martin', 'USA'),
(9, 'Daniel Garcia', 'India'),
(10, 'Isabella Thomas', 'Germany'),
(11, 'William White', 'Canada'),
(12, 'Mia Harris', 'UK'),
(13, 'Benjamin Clark', 'Australia'),
(14, 'Charlotte Rodriguez', 'Germany'),
(15, 'Henry Lewis', 'India'),
(16, 'Amelia Walker', 'USA'),
(17, 'Lucas Hall', 'Australia'),
(18, 'Evelyn Allen', 'UK'),
(19, 'Alexander Young', 'Canada'),
(20, 'Harper King', 'India');
go

CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,
    Name VARCHAR(50),
    Age INT,
    Department VARCHAR(50),
    Salary INT,
    City VARCHAR(50)
);
go

-- Insert sample data
INSERT INTO Employees (EmployeeID, Name, Age, Department, Salary, City) VALUES
(1, 'John Smith', 28, 'HR', 50000, 'New York'),
(2, 'Alice Lee', 35, 'IT', 75000, 'Los Angeles'),
(3, 'Mark Brown', 40, 'Finance', 80000, 'Chicago'),
(4, 'Sophia Kim', 30, 'IT', 70000, 'Seattle'),
(5, 'David Park', 50, 'HR', 60000, 'New York'),
(6, 'Emma Chen', 27, 'IT', 72000, 'Boston'),
(7, 'James Li', 33, 'Finance', 85000, 'Chicago'),
(8, 'Olivia Wu', 45, 'HR', 65000, 'Los Angeles'),
(9, 'Daniel Xu', 29, 'IT', 68000, 'Seattle'),
(10, 'Mia Zhang', 38, 'Finance', 90000, 'Boston');

go

