CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `login` varchar(100) NOT NULL,
  `password` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_login_IDX` (`login`) USING BTREE
);
CREATE TABLE IF NOT EXISTS `todos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(255) DEFAULT NULL,
  `done` tinyint(1) DEFAULT '0',
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `todos_user_id_IDX` (`user_id`) USING BTREE,
  CONSTRAINT `todos_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
CREATE TABLE IF NOT EXISTS `profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) Default Null,
  `email` varchar (255) Default Null,
  `text` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `profile_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);