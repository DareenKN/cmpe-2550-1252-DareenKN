-- phpMyAdmin SQL Dump
-- version 4.0.8
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 24, 2014 at 01:03 PM
-- Server version: 5.1.72-cll
-- PHP Version: 5.3.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `demo_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `titles`
--

CREATE TABLE IF NOT EXISTS `titles` (
  `title_id` varchar(6) NOT NULL,
  `title` varchar(80) NOT NULL,
  `type` char(12) NOT NULL DEFAULT 'UNDECIDED',
  `pub_id` char(4) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `advance` decimal(10,2) DEFAULT NULL,
  `royalty` int(11) DEFAULT NULL,
  `ytd_sales` int(11) DEFAULT NULL,
  `notes` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`title_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `titles`
--

INSERT INTO `titles` (`title_id`, `title`, `type`, `pub_id`, `price`, `advance`, `royalty`, `ytd_sales`, `notes`) VALUES
('BU1032', 'The Busy Executive''s Database Guide', 'business', '1389', '19.99', '5000.00', 10, 4095, 'An overview of available database systems with emphasis on common business applications. Illustrated.'),
('BU1111', 'Cooking with Computers: Surreptitious Balance Sheets', 'business', '1389', '19.99', '5000.00', 10, 3876, 'Helpful hints on how to use your electronic resources to the best advantage.'),
('BU2075', 'You Can Combat Computer Stress!', 'business', '0736', '19.99', '10125.00', 24, 18722, 'The latest medical and psychological techniques for living with the electronic office. Easy-to-understand explanations.'),
('BU7832', 'Straight Talk About Computers', 'business', '1389', '19.99', '5000.00', 10, 4095, 'Annotated analysis of what computers can do for you: a no-hype guide for the critical user.'),
('MC2222', 'Silicon Valley Gastronomic Treats', 'mod_cook', '0877', '19.99', '0.00', 12, 2032, 'Favorite recipes for quick, easy, and elegant meals.'),
('MC3021', 'The Gourmet Microwave', 'mod_cook', '0877', '19.99', '15000.00', 24, 22246, 'Traditional French gourmet recipes adapted for modern microwave cooking.'),
('PC1035', 'But Is It User Friendly?', 'popular_comp', '1389', '19.99', '7000.00', 16, 8780, 'A survey of software for the naive user, focusing on the ''friendliness'' of each.'),
('PC8888', 'Secrets of Silicon Valley', 'popular_comp', '1389', '19.99', '8000.00', 10, 4095, 'Muckraking reporting on the world''s largest computer hardware and software manufacturers.'),
('PC9999', 'It Goes to Eleven', 'music', '0736', '19.99', '6900.00', 10, 375, 'Follow Nigel on Tour with Spinal Tap'),
('PS1372', 'Computer Phobic AND Non-Phobic Individuals: Behavior Variations', 'psychology', '0877', '19.99', '7000.00', 10, 375, 'A must for the specialist, this book examines the difference between those who hate and fear computers and those who don''t.'),
('PS2091', 'Is Anger the Enemy?', 'psychology', '0736', '19.99', '2275.00', 12, 2045, 'Carefully researched study of the effects of strong emotions on the body. Metabolic charts included.'),
('PS2106', 'Life Without Fear', 'psychology', '0736', '19.99', '6000.00', 10, 111, 'New exercise, meditation, and nutritional techniques that can reduce the shock of daily interactions. Popular audience. Sample menus included, exercise video available separately.'),
('PS3333', 'Prolonged Data Deprivation: Four Case Studies', 'psychology', '0736', '19.99', '2000.00', 10, 4072, 'What happens when the data runs dry?  Searching evaluations of information-shortage effects.'),
('PS7777', 'Emotional Security: A New Algorithm', 'psychology', '0736', '19.99', '4000.00', 10, 3336, 'Protecting yourself and your loved ones from undue emotional stress in the modern world. Use of computer and nutritional aids emphasized.'),
('TC3218', 'Onions, Leeks, and Garlic: Cooking Secrets of the Mediterranean', 'trad_cook', '0877', '19.99', '7000.00', 10, 375, 'Profusely illustrated in color, this makes a wonderful gift book for a cuisine-oriented friend.'),
('TC4203', 'Fifty Years in Buckingham Palace Kitchens', 'trad_cook', '0877', '19.99', '4000.00', 14, 15096, 'More anecdotes from the Queen''s favorite cook describing life among English royalty. Recipes, techniques, tender vignettes.'),
('TC7777', 'Sushi, Anyone?', 'trad_cook', '0877', '19.99', '8000.00', 10, 4095, 'Detailed instructions on how to make authentic Japanese sushi in your spare time.');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
