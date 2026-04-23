/* Replace DB name with your name*/
-- Use Ctrl + H to open find and replace popup
-- and replace [LabExam05_dkinganjatou1] with your name
use master
go

drop database if exists [LabExam05_dkinganjatou1]
go
create database [LabExam05_dkinganjatou1]
go

use [LabExam05_dkinganjatou1]
go

drop table if exists Merchandise
go



CREATE TABLE Merchandise (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Stock INT NOT NULL
);


INSERT INTO Merchandise (Name, Category, Price, Stock)
VALUES 
('Oilers Hoodie', 'Apparel', 80.00, 40),
('Oilers Scarf', 'Accessories', 25.00, 150),
('Oilers Beanie', 'Accessories', 20.00, 200),
('Oilers T-shirt', 'Apparel', 35.00, 120),
('Oilers Socks', 'Apparel', 15.00, 300),
('Oilers Jacket', 'Apparel', 150.00, 30),
('Oilers Shorts', 'Apparel', 40.00, 60),
('Oilers Backpack', 'Accessories', 60.00, 70),
('Oilers Wallet', 'Accessories', 25.00, 110),
('Oilers Blanket', 'Collectibles', 45.00, 50),
('Oilers Wall Flag', 'Decor', 30.00, 70),
('Oilers Poster', 'Decor', 10.00, 150),
('Oilers Desk Lamp', 'Home Decor', 50.00, 20),
('Oilers Phone Case', 'Accessories', 15.00, 250),
('Oilers Water Bottle', 'Accessories', 18.00, 180),
('Oilers Coasters (Set of 4)', 'Collectibles', 25.00, 90),
('Oilers Keyring Flashlight', 'Accessories', 12.00, 200),
('Oilers Pin Badge', 'Accessories', 8.00, 500),
('Oilers Gift Box', 'Miscellaneous', 100.00, 25),
('Oilers Earphones', 'Electronics', 30.00, 50),
('Oilers Game Puck', 'Collectibles', 15.00, 400),
('Oilers Replica Stick', 'Collectibles', 60.00, 20),
('Oilers Coffee Tumbler', 'Accessories', 20.00, 150),
('Oilers Chair Cushion', 'Home Decor', 35.00, 80),
('Oilers Banner', 'Decor', 25.00, 60),
('Oilers Helmet Keychain', 'Accessories', 10.00, 300),
('Oilers Wristband', 'Accessories', 5.00, 400),
('Oilers Pen Set', 'Office Supplies', 12.00, 200),
('Oilers Calendar', 'Office Supplies', 15.00, 120),
('Oilers Keychain', 'Accessories', 10.00, 300);
go


--SELECT * FROM Merchandise