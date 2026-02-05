-- =========================================
-- Database setup
-- =========================================
CREATE DATABASE IF NOT EXISTS dkinganjatou1251_Test;
USE dkinganjatou1251_Test;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- =========================================
-- Drop tables (safe re-import)
-- =========================================
DROP TABLE IF EXISTS titleauthor;
DROP TABLE IF EXISTS titles;
DROP TABLE IF EXISTS authors;

-- =========================================
-- Authors table
-- =========================================
CREATE TABLE authors (
    au_id VARCHAR(11) PRIMARY KEY,
    au_lname VARCHAR(40) NOT NULL,
    au_fname VARCHAR(20) NOT NULL,
    phone CHAR(12) NOT NULL DEFAULT 'UNKNOWN'
) ENGINE=InnoDB;

-- =========================================
-- Titles table
-- =========================================
CREATE TABLE titles (
    title_id VARCHAR(6) PRIMARY KEY,
    title VARCHAR(80) NOT NULL,
    type CHAR(12) NOT NULL DEFAULT 'UNDECIDED',
    pub_id CHAR(4),
    price DECIMAL(10,2),
    advance DECIMAL(10,2),
    royalty INT,
    ytd_sales INT,
    notes VARCHAR(200)
) ENGINE=InnoDB;

-- =========================================
-- TitleAuthor junction table
-- =========================================
CREATE TABLE titleauthor (
    au_id VARCHAR(11) NOT NULL,
    title_id VARCHAR(6) NOT NULL,
    PRIMARY KEY (au_id, title_id),
    CONSTRAINT fk_titleauthor_author
        FOREIGN KEY (au_id) REFERENCES authors(au_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_titleauthor_title
        FOREIGN KEY (title_id) REFERENCES titles(title_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- Insert authors
-- =========================================
INSERT INTO authors VALUES
('409-56-7008', 'Bennet', 'Abraham', '415 658-9932'),
('213-46-8915', 'Green', 'Marjorie', '415 986-7020'),
('238-95-7766', 'Carson', 'Cheryl', '415 548-7723'),
('998-72-3567', 'Ringer', 'Albert', '801 826-0752'),
('899-46-2035', 'Ringer', 'Anne', '801 826-0752'),
('722-51-5454', 'DeFrance', 'Michel', '219 547-9982'),
('807-91-6654', 'Panteley', 'Sylvia', '301 946-8853'),
('893-72-1158', 'McBadden', 'Heather', '707 448-4982'),
('724-08-9931', 'Stringer', 'Dirk', '415 843-2991'),
('274-80-9391', 'Straight', 'Dean', '415 834-2919'),
('756-30-7391', 'Karsen', 'Livia', '415 534-9219'),
('724-80-9391', 'MacFeather', 'Stearns', '415 354-7128'),
('427-17-2319', 'Dull', 'Ann', '415 836-7128'),
('672-71-3249', 'Yokomoto', 'Akiko', '415 935-4228'),
('267-41-2394', 'O''Leary', 'Michael', '408 286-2428'),
('472-27-2349', 'Gringlesby', 'Burt', '707 938-6445'),
('527-72-3246', 'Greene', 'Morningstar', '615 297-2723'),
('172-32-1176', 'White', 'Johnson', '408 496-7223'),
('712-45-1867', 'del Castillo', 'Innes', '615 996-8275'),
('846-92-7186', 'Hunter', 'Sheryl', '415 836-7128'),
('486-29-1786', 'Locksley', 'Charlene', '415 585-4620'),
('648-92-1872', 'Blotchet-Halls', 'Reginald', '503 745-6402'),
('341-22-1782', 'Smith', 'Meander', '913 843-0462');

-- =========================================
-- Insert titles
-- =========================================
INSERT INTO titles VALUES
('BU1032', 'The Busy Executive''s Database Guide', 'business', '1389', 19.99, 5000, 10, 4095, 'Overview of database systems.'),
('BU1111', 'Cooking with Computers', 'business', '1389', 19.99, 5000, 10, 3876, 'Electronic resources guide.'),
('BU2075', 'You Can Combat Computer Stress!', 'business', '0736', 19.99, 10125, 24, 18722, NULL),
('BU7832', 'Straight Talk About Computers', 'business', '1389', 19.99, 5000, 10, 4095, NULL),
('MC2222', 'Silicon Valley Gastronomic Treats', 'mod_cook', '0877', 19.99, 0, 12, 2032, NULL),
('MC3021', 'The Gourmet Microwave', 'mod_cook', '0877', 19.99, 15000, 24, 22246, NULL),
('PC1035', 'But Is It User Friendly?', 'popular_comp', '1389', 19.99, 7000, 16, 8780, NULL),
('PC8888', 'Secrets of Silicon Valley', 'popular_comp', '1389', 19.99, 8000, 10, 4095, NULL),
('PC9999', 'It Goes to Eleven', 'music', '0736', 19.99, 6900, 10, 375, NULL),
('PS1372', 'Computer Phobic Individuals', 'psychology', '0877', 19.99, 7000, 10, 375, NULL),
('PS2091', 'Is Anger the Enemy?', 'psychology', '0736', 19.99, 2275, 12, 2045, NULL),
('PS2106', 'Life Without Fear', 'psychology', '0736', 19.99, 6000, 10, 111, NULL),
('PS3333', 'Prolonged Data Deprivation', 'psychology', '0736', 19.99, 2000, 10, 4072, NULL),
('PS7777', 'Emotional Security', 'psychology', '0736', 19.99, 4000, 10, 3336, NULL),
('TC3218', 'Onions, Leeks, and Garlic', 'trad_cook', '0877', 19.99, 7000, 10, 375, NULL),
('TC4203', 'Fifty Years in Buckingham Palace Kitchens', 'trad_cook', '0877', 19.99, 4000, 14, 15096, NULL),
('TC7777', 'Sushi, Anyone?', 'trad_cook', '0877', 19.99, 8000, 10, 4095, NULL);

-- =========================================
-- Insert title-author relationships
-- =========================================
INSERT INTO titleauthor VALUES
('409-56-7008', 'BU1032'),
('486-29-1786', 'PS7777'),
('486-29-1786', 'PC9999'),
('712-45-1867', 'MC2222'),
('172-32-1176', 'PS3333'),
('213-46-8915', 'BU1032'),
('238-95-7766', 'PC1035'),
('213-46-8915', 'BU2075'),
('998-72-3567', 'PS2091'),
('899-46-2035', 'PS2091'),
('998-72-3567', 'PS2106'),
('722-51-5454', 'MC3021'),
('899-46-2035', 'MC3021'),
('807-91-6654', 'TC3218'),
('274-80-9391', 'BU7832'),
('427-17-2319', 'PC8888'),
('846-92-7186', 'PC8888'),
('756-30-7391', 'PS1372'),
('724-80-9391', 'PS1372'),
('724-80-9391', 'BU1111'),
('267-41-2394', 'BU1111'),
('672-71-3249', 'TC7777'),
('267-41-2394', 'TC7777'),
('472-27-2349', 'TC7777'),
('648-92-1872', 'TC4203');
