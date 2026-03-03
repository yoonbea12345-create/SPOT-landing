CREATE TABLE `emailSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`agreedAt` timestamp NOT NULL DEFAULT (now()),
	`source` varchar(64) NOT NULL DEFAULT 'landing',
	`ipAddress` varchar(45),
	CONSTRAINT `emailSubscriptions_id` PRIMARY KEY(`id`)
);
