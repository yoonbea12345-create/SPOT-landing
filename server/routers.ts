import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { accessLogs, eventLogs, emailSubscriptions } from "../drizzle/schema";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Access log tracking
  log: router({
    track: publicProcedure
      .input(
        z.object({
          pathname: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          console.warn("[AccessLog] Database not available");
          return { success: false, logId: null };
        }

        try {
          const ipAddress =
            (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
            (ctx.req.headers["x-real-ip"] as string) ||
            ctx.req.socket?.remoteAddress ||
            "unknown";

          // IP whitelist - skip logging for owner's devices
          const IP_WHITELIST = [
            "221.141.9.83",
            "112.221.224.125",
            "211.235.89.25",
            "2001:2d8:71a3:b0c2:2c69:8653:d08a:4d8f",
          ];
          if (IP_WHITELIST.includes(ipAddress)) {
            return { success: true, logId: null };
          }

          const result = await db.insert(accessLogs).values({
            ipAddress,
            userAgent: ctx.req.headers["user-agent"] || null,
            referer: ctx.req.headers["referer"] || null,
            pathname: input.pathname,
          });

          return { success: true, logId: Number(result[0].insertId) };
        } catch (error) {
          console.error("[AccessLog] Failed to log access:", error);
          return { success: false, logId: null };
        }
      }),

    // Update GPS location for an existing log entry
    trackGps: publicProcedure
      .input(
        z.object({
          logId: z.number(),
          lat: z.number(),
          lng: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        try {
          const { eq } = await import("drizzle-orm");
          await db.update(accessLogs)
            .set({ gpsLat: input.lat, gpsLng: input.lng })
            .where(eq(accessLogs.id, input.logId));
          return { success: true };
        } catch (error) {
          console.error("[AccessLog] Failed to update GPS:", error);
          return { success: false };
        }
      }),

    // Update session duration for an existing log entry
    updateDuration: publicProcedure
      .input(
        z.object({
          logId: z.number(),
          durationSec: z.number().min(0).max(86400),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        try {
          const { eq } = await import("drizzle-orm");
          await db.update(accessLogs)
            .set({ durationSec: input.durationSec })
            .where(eq(accessLogs.id, input.logId));
          return { success: true };
        } catch (error) {
          console.error("[AccessLog] Failed to update duration:", error);
          return { success: false };
        }
      }),

    // Track button click / user interaction events
    trackEvent: publicProcedure
      .input(
        z.object({
          eventName: z.string().max(128),
          page: z.string().max(512),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) return { success: false };
        try {
          const ipAddress =
            (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
            (ctx.req.headers["x-real-ip"] as string) ||
            ctx.req.socket?.remoteAddress ||
            "unknown";

          const IP_WHITELIST = [
            "221.141.9.83",
            "112.221.224.125",
            "211.235.89.25",
            "2001:2d8:71a3:b0c2:2c69:8653:d08a:4d8f",
          ];
          if (IP_WHITELIST.includes(ipAddress)) return { success: true };

          await db.insert(eventLogs).values({
            ipAddress,
            eventName: input.eventName,
            page: input.page,
          });
          return { success: true };
        } catch (error) {
          console.error("[EventLog] Failed to track event:", error);
          return { success: false };
        }
      }),

    // Get access logs with pagination
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          return { logs: [], total: 0 };
        }

        try {
          const { desc, count } = await import("drizzle-orm");
          
          const totalResult = await db.select({ count: count() }).from(accessLogs);
          const total = totalResult[0]?.count || 0;

          const logs = await db
            .select()
            .from(accessLogs)
            .orderBy(desc(accessLogs.timestamp))
            .limit(input.limit)
            .offset(input.offset);

          return { logs, total };
        } catch (error) {
          console.error("[AccessLog] Failed to fetch logs:", error);
          return { logs: [], total: 0 };
        }
      }),

    // Get event logs with pagination
    listEvents: publicProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { logs: [], total: 0 };
        try {
          const { desc, count } = await import("drizzle-orm");
          const totalResult = await db.select({ count: count() }).from(eventLogs);
          const total = totalResult[0]?.count || 0;
          const logs = await db
            .select()
            .from(eventLogs)
            .orderBy(desc(eventLogs.timestamp))
            .limit(input.limit)
            .offset(input.offset);
          return { logs, total };
        } catch (error) {
          console.error("[EventLog] Failed to fetch logs:", error);
          return { logs: [], total: 0 };
        }
      }),

    // Daily stats for chart (last 14 days, KST)
    dailyStats: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { stats: [] };
      try {
        const { sql } = await import("drizzle-orm");
        // KST = UTC+9, use DATE_FORMAT with +9h offset
        const rows = await db.execute(sql`
          SELECT
            DATE_FORMAT(CONVERT_TZ(timestamp, '+00:00', '+09:00'), '%Y-%m-%d') AS day,
            COUNT(*) AS visits,
            COUNT(DISTINCT ipAddress) AS unique_visitors
          FROM accessLogs
          WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 14 DAY)
          GROUP BY day
          ORDER BY day ASC
        `);
        return { stats: rows[0] as unknown as Array<{ day: string; visits: number; unique_visitors: number }> };
      } catch (error) {
        console.error("[DailyStats] Failed:", error);
        return { stats: [] };
      }
    }),

    // Event summary - count by event name
    eventSummary: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { summary: [] };
      try {
        const { sql } = await import("drizzle-orm");
        const rows = await db.execute(sql`
          SELECT eventName, COUNT(*) AS cnt
          FROM eventLogs
          GROUP BY eventName
          ORDER BY cnt DESC
        `);
        return { summary: rows[0] as unknown as Array<{ eventName: string; cnt: number }> };
      } catch (error) {
        console.error("[EventSummary] Failed:", error);
        return { summary: [] };
      }
    }),

    // Funnel stats: 보러가기 클릭 → MVP 접속 → GPS 허용
    funnelStats: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { funnel: [] };
      try {
        const { sql } = await import("drizzle-orm");
        // Step 1: 보러가기 버튼 클릭 수
        const step1 = await db.execute(sql`
          SELECT COUNT(*) AS cnt FROM eventLogs
          WHERE eventName LIKE 'click_%보러가기%'
        `);
        // Step 2: /mvp 페이지 접속 수
        const step2 = await db.execute(sql`
          SELECT COUNT(*) AS cnt FROM accessLogs
          WHERE pathname = '/mvp'
        `);
        // Step 3: GPS 허용 수 (gpsLat이 있는 /mvp 로그)
        const step3 = await db.execute(sql`
          SELECT COUNT(*) AS cnt FROM accessLogs
          WHERE pathname = '/mvp' AND gpsLat IS NOT NULL
        `);
        const s1 = Number(((step1[0] as unknown) as any[])[0]?.cnt || 0);
        const s2 = Number(((step2[0] as unknown) as any[])[0]?.cnt || 0);
        const s3 = Number(((step3[0] as unknown) as any[])[0]?.cnt || 0);
        return {
          funnel: [
            { step: "보러가기 클릭", count: s1, rate: 100 },
            { step: "MVP 지도 접속", count: s2, rate: s1 > 0 ? Math.round((s2 / s1) * 100) : 0 },
            { step: "GPS 허용", count: s3, rate: s2 > 0 ? Math.round((s3 / s2) * 100) : 0 },
          ],
        };
      } catch (error) {
        console.error("[FunnelStats] Failed:", error);
        return { funnel: [] };
      }
    }),

    // GPS locations for map visualization
    gpsLocations: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { locations: [] };
      try {
        const { isNotNull } = await import("drizzle-orm");
        const locations = await db
          .select({
            id: accessLogs.id,
            lat: accessLogs.gpsLat,
            lng: accessLogs.gpsLng,
            timestamp: accessLogs.timestamp,
            ipAddress: accessLogs.ipAddress,
          })
          .from(accessLogs)
          .where(isNotNull(accessLogs.gpsLat))
          .orderBy(accessLogs.timestamp);
        return { locations };
      } catch (error) {
        console.error("[GpsLocations] Failed:", error);
        return { locations: [] };
      }
    }),
  }),

  // Email subscription management
  email: router({
    // Subscribe with email (called from landing page)
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email().max(320),
          source: z.string().max(64).default("landing"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) return { success: false };
        try {
          const ipAddress =
            (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
            (ctx.req.headers["x-real-ip"] as string) ||
            ctx.req.socket?.remoteAddress ||
            "unknown";
          // Upsert: ignore duplicate emails
          await db.insert(emailSubscriptions).ignore().values({
            email: input.email,
            source: input.source,
            ipAddress,
          });
          return { success: true };
        } catch (error) {
          console.error("[Email] Failed to subscribe:", error);
          return { success: false };
        }
      }),

    // List all email subscriptions (admin)
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(200).default(100),
          offset: z.number().min(0).default(0),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { emails: [], total: 0 };
        try {
          const { desc, count } = await import("drizzle-orm");
          const totalResult = await db.select({ count: count() }).from(emailSubscriptions);
          const total = totalResult[0]?.count || 0;
          const emails = await db
            .select()
            .from(emailSubscriptions)
            .orderBy(desc(emailSubscriptions.agreedAt))
            .limit(input.limit)
            .offset(input.offset);
          return { emails, total };
        } catch (error) {
          console.error("[Email] Failed to list:", error);
          return { emails: [], total: 0 };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
