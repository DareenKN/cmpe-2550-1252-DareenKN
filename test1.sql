CREATE TABLE authors (
    au_id VARCHAR(11) PRIMARY KEY,
    au_lname VARCHAR(40) NOT NULL,
    au_fname VARCHAR(20) NOT NULL,
    phone CHAR(12) NOT NULL DEFAULT 'UNKNOWN'
) 


CREATE TABLE titleauthor (
    au_id VARCHAR(11) NOT NULL,
    title_id VARCHAR(6) NOT NULL,
    PRIMARY KEY (au_id, title_id),
    FOREIGN KEY (au_id) REFERENCES authors(au_id),
    FOREIGN KEY (title_id) REFERENCES titles(title_id)
)

INSERT INTO titleauthor (au_id, title_id) VALUES
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


INSERT INTO authors
   VALUES('409-56-7008', 'Bennet', 'Abraham', '415 658-9932');
INSERT INTO authors
   VALUES('213-46-8915', 'Green', 'Marjorie', '415 986-7020');
INSERT INTO authors
   VALUES('238-95-7766', 'Carson', 'Cheryl', '415 548-7723');
INSERT INTO authors
   VALUES('998-72-3567', 'Ringer', 'Albert', '801 826-0752');
INSERT INTO authors
   VALUES('899-46-2035', 'Ringer', 'Anne', '801 826-0752');
INSERT INTO authors
   VALUES('722-51-5454', 'DeFrance', 'Michel', '219 547-9982');
INSERT INTO authors
   VALUES('807-91-6654', 'Panteley', 'Sylvia', '301 946-8853');
INSERT INTO authors
   VALUES('893-72-1158', 'McBadden', 'Heather', '707 448-4982');
INSERT INTO authors
   VALUES('724-08-9931', 'Stringer', 'Dirk', '415 843-2991');
INSERT INTO authors
   VALUES('274-80-9391', 'Straight', 'Dean', '415 834-2919');
INSERT INTO authors
   VALUES('756-30-7391', 'Karsen', 'Livia', '415 534-9219');
INSERT INTO authors
   VALUES('724-80-9391', 'MacFeather', 'Stearns', '415 354-7128');
INSERT INTO authors
   VALUES('427-17-2319', 'Dull', 'Ann', '415 836-7128');
INSERT INTO authors
   VALUES('672-71-3249', 'Yokomoto', 'Akiko', '415 935-4228');
INSERT INTO authors
   VALUES('267-41-2394', 'O''Leary', 'Michael', '408 286-2428');
INSERT INTO authors
   VALUES('472-27-2349', 'Gringlesby', 'Burt', '707 938-6445');
INSERT INTO authors
   VALUES('527-72-3246', 'Greene', 'Morningstar', '615 297-2723');
INSERT INTO authors
   VALUES('172-32-1176', 'White', 'Johnson', '408 496-7223');
INSERT INTO authors
   VALUES('712-45-1867', 'del Castillo', 'Innes', '615 996-8275');
INSERT INTO authors
   VALUES('846-92-7186', 'Hunter', 'Sheryl', '415 836-7128');
INSERT INTO authors
   VALUES('486-29-1786', 'Locksley', 'Charlene', '415 585-4620');
INSERT INTO authors
   VALUES('648-92-1872', 'Blotchet-Halls', 'Reginald', '503 745-6402');
INSERT INTO authors
   VALUES('341-22-1782', 'Smith', 'Meander', '913 843-0462');