CREATE TABLE `userSpots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mbti` varchar(8) NOT NULL,
	`mood` varchar(64) NOT NULL,
	`mode` varchar(64) NOT NULL,
	`sign` varchar(128) NOT NULL,
	`lat` double NOT NULL,
	`lng` double NOT NULL,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userSpots_id` PRIMARY KEY(`id`)
);
