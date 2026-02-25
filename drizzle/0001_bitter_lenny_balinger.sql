CREATE TABLE `accessLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ipAddress` varchar(45) NOT NULL,
	`userAgent` text,
	`referer` text,
	`pathname` varchar(512) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accessLogs_id` PRIMARY KEY(`id`)
);
