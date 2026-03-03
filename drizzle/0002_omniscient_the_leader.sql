CREATE TABLE `eventLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ipAddress` varchar(45) NOT NULL,
	`eventName` varchar(128) NOT NULL,
	`page` varchar(512) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `eventLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `accessLogs` ADD `gpsLat` double;--> statement-breakpoint
ALTER TABLE `accessLogs` ADD `gpsLng` double;--> statement-breakpoint
ALTER TABLE `accessLogs` ADD `durationSec` int;