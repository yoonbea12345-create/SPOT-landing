import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { accessLogs } from "../drizzle/schema";

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
          return { success: false };
        }

        try {
          // Get IP address from various headers (proxy-aware)
          const ipAddress =
            (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
            (ctx.req.headers["x-real-ip"] as string) ||
            ctx.req.socket?.remoteAddress ||
            "unknown";

          // IP whitelist - skip logging for owner's devices
          const IP_WHITELIST = [
            "221.141.9.83",
          ];
          if (IP_WHITELIST.includes(ipAddress)) {
            return { success: true };
          }

          await db.insert(accessLogs).values({
            ipAddress,
            userAgent: ctx.req.headers["user-agent"] || null,
            referer: ctx.req.headers["referer"] || null,
            pathname: input.pathname,
          });

          return { success: true };
        } catch (error) {
          console.error("[AccessLog] Failed to log access:", error);
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
          const { desc, sql, count } = await import("drizzle-orm");
          
          // Get total count
          const totalResult = await db.select({ count: count() }).from(accessLogs);
          const total = totalResult[0]?.count || 0;

          // Get paginated logs
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
  }),
});

export type AppRouter = typeof appRouter;
