import { double, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Access logs table
export const accessLogs = mysqlTable("accessLogs", {
  id: int("id").autoincrement().primaryKey(),
  ipAddress: varchar("ipAddress", { length: 45 }).notNull(), // IPv6 support
  userAgent: text("userAgent"),
  referer: text("referer"),
  pathname: varchar("pathname", { length: 512 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  // GPS location (collected from /mvp page)
  gpsLat: double("gpsLat"),
  gpsLng: double("gpsLng"),
  // Session duration in seconds
  durationSec: int("durationSec"),
});

export type AccessLog = typeof accessLogs.$inferSelect;
export type InsertAccessLog = typeof accessLogs.$inferInsert;

// Event logs table - button clicks and user interactions
export const eventLogs = mysqlTable("eventLogs", {
  id: int("id").autoincrement().primaryKey(),
  ipAddress: varchar("ipAddress", { length: 45 }).notNull(),
  eventName: varchar("eventName", { length: 128 }).notNull(), // e.g. "click_보러가기", "click_출시알림"
  page: varchar("page", { length: 512 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type EventLog = typeof eventLogs.$inferSelect;
export type InsertEventLog = typeof eventLogs.$inferInsert;

// Email subscriptions table - beta launch notification sign-ups
export const emailSubscriptions = mysqlTable("emailSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  agreedAt: timestamp("agreedAt").defaultNow().notNull(),
  source: varchar("source", { length: 64 }).default("landing").notNull(), // e.g. "landing", "mvp"
  ipAddress: varchar("ipAddress", { length: 45 }),
});

export type EmailSubscription = typeof emailSubscriptions.$inferSelect;
export type InsertEmailSubscription = typeof emailSubscriptions.$inferInsert;