-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: May 22, 2026 at 02:38 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gweb_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `min_players` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `clicks` int(11) DEFAULT 0,
  `image_link` text DEFAULT NULL,
  `game_link` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `developer` varchar(100) DEFAULT 'G-Web Studios'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`id`, `title`, `category`, `min_players`, `status`, `clicks`, `image_link`, `game_link`, `description`, `created_at`, `developer`) VALUES
(1, 'Rol Dice', 'Utility', 1, 'Active', 0, 'image/Roll dice.png', '\\Web Games\\Roll Dice App\\index.html', 'Roll the virtual dice to quickly and easily generate random numbers for your games.', '2026-05-20 23:36:04', 'G-Web Studios'),
(2, 'Lottery Spin Wheel', 'Casual', 1, 'Active', 0, 'image/Spin.png', '\\Web Games\\Lottery Spin Wheel\\index.html', 'Spin the digital wheel of fortune and leave prize drawing or decision-making up to chance.', '2026-05-20 23:36:04', 'G-Web Studios'),
(3, 'Simple X/O', 'Board', 2, 'Active', 0, 'image/Simple X-O.png', '\\Web Games\\Simple X-O\\index.html', 'The classic Tic-Tac-Toe game where you need to align three identical marks in a row, column, or diagonal.', '2026-05-20 23:36:04', 'G-Web Studios'),
(4, 'Ping Pong', 'Arcade', 1, 'Active', 0, 'image/Neo Ping-Pong.png', '\\Web Games\\Ping-Pong Game\\index.html', 'Hit the bouncing ball back with your paddle and defeat your opponent in this fast-paced, retro-style game.', '2026-05-20 23:36:04', 'G-Web Studios'),
(5, 'Chess Game', 'Strategy', 1, 'Active', 0, 'image/Chess Game.jpg', '\\Web Games\\Chess Game\\index.html', 'Test your logic and strategic skills in one of the world\'s most popular classic board games.', '2026-05-20 23:36:04', 'G-Web Studios'),
(6, 'Mine Sweeper', 'Puzzle', 1, 'Active', 0, 'image/Mine Sweeper.png', '\\Web Games\\Mine Sweeper\\index.html', 'Uncover the grid using numbers as clues and find all the hidden mines without blowing up.', '2026-05-20 23:36:04', 'G-Web Studios'),
(7, 'Snake Game', 'Arcade', 1, 'Active', 0, 'image/Snake Game.png', '\\Web Games\\Snake Game\\index.html', 'Guide the ever-growing snake and eat as many points as possible without crashing into the walls or yourself.', '2026-05-20 23:36:04', 'G-Web Studios'),
(8, '2048 Game', 'Puzzle', 1, 'Active', 0, 'image/2048 Game.png', '\\Web Games\\2048 Game\\index.html', 'Slide and combine matching numbers on the board to eventually reach the magic tile of 2048.', '2026-05-20 23:36:04', 'G-Web Studios'),
(9, 'Modern Tetris Game', 'Arcade', 1, 'Active', 0, 'image/Tetris.jpg', '\\Web Games\\Tetris Clone Game\\index.html', 'Rotate and fit the falling blocks together to build complete lines and clear them from the screen for points.', '2026-05-20 23:36:04', 'G-Web Studios');

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `game_title` varchar(100) NOT NULL,
  `score` int(11) NOT NULL,
  `achieved_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `level` varchar(50) DEFAULT '-',
  `duration` varchar(20) DEFAULT '0:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`id`, `user_id`, `username`, `game_title`, `score`, `achieved_at`, `level`, `duration`) VALUES
(58, 1, 'Mr.Erik', '2048 Game', 1388, '2026-05-21 20:52:47', 'Standard', '01:03'),
(61, 1, 'Mr.Erik', 'Snake Game', 10, '2026-05-21 20:57:51', 'Classic', '00:00'),
(62, 1, 'Mr.Erik', 'Tetris', 1400, '2026-05-21 21:02:44', '2', '0:00'),
(65, 1, 'Mr.Erik', 'Mine Sweeper', 0, '2026-05-21 21:12:57', 'Hard', '00:50'),
(69, 1, 'Mr.Erik', 'Bounce Ball', 210, '2026-05-21 21:32:45', 'Level 1', '00:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(11) DEFAULT 2,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_picture` varchar(255) DEFAULT 'default-avatar.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `profile_picture`) VALUES
(1, 'Mr.Erik', 'erik@gmail.com', '$2b$10$sz.9HZ.NC7ibrlFbifAPauNlqfwFc6CKISFVITwRF0QpLsNCEP36u', 1, '2026-05-19 18:13:36', 'admin-avatar.png'),
(2, 'Anna_Anime', 'anna@gmail.com', '$2b$10$wNjhudnEM2OryK7LVIIlSOExYZtdygd/WkHUGbR5hlpW4lZ6VNm.C', 2, '2026-05-19 23:16:24', '/image/Anime-avatar.png'),
(3, 'Test_open', 'test@gmail.com', '$2b$10$xgUCPEpxE.gc514TuMCh5OeF0S7o46wbUhRFdIa8PaybF/Sv1fBl6', 2, '2026-05-19 23:16:39', '/image/user-avatar.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`game_id`),
  ADD KEY `game_id` (`game_id`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
