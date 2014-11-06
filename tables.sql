CREATE DATABASE IF NOT EXISTS `project`;

USE `project`;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` varchar(20) NOT NULL,
  `name` varchar(40) NOT NULL,
  PRIMARY KEY (`user_id`)
);




CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` varchar(20) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `url` varchar(100) NOT NULL,
  PRIMARY KEY (`user_id`)
);





