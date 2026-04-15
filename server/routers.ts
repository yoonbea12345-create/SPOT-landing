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
            "2001:2d8:2183:48bf::6089:339b",
            "2001:2d8:210e:548e::60ca:339b",
            // 내부 로칼호스트 (Manus 샌드박스 상태체크)
            "::ffff:127.0.0.1",
            "127.0.0.1",
            "::1",
          ];
          if (IP_WHITELIST.includes(ipAddress)) {
            return { success: true, logId: null };
          }

          // 봇/크롤러 User-Agent 필터링
          const userAgent = (ctx.req.headers["user-agent"] || "").toLowerCase();
          const BOT_PATTERNS = [
            "googlebot", "bingbot", "slurp", "duckduckbot", "baiduspider",
            "yandexbot", "sogou", "exabot", "facebot", "ia_archiver",
            "twitterbot", "linkedinbot", "whatsapp", "telegrambot",
            "applebot", "semrushbot", "ahrefsbot", "mj12bot", "dotbot",
            "petalbot", "bytespider", "gptbot", "claudebot", "anthropic",
            "python-requests", "go-http-client", "curl", "wget", "axios",
            "node-fetch", "okhttp", "java/", "libwww", "scrapy",
            "facebookexternalhit", "rogerbot", "embedly", "quora link preview",
          ];
          if (BOT_PATTERNS.some(p => userAgent.includes(p))) {
            return { success: true, logId: null };
          }

          // 빈 User-Agent도 봇으로 간주
          if (!userAgent || userAgent.length < 10) {
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
            "2001:2d8:2183:48bf::6089:339b",
            "2001:2d8:210e:548e::60ca:339b",
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
        // Step 4: 평균 체류 시간 (durationSec이 있는 로그 기준)
        const avgDurLanding = await db.execute(sql`
          SELECT AVG(durationSec) AS avg, COUNT(*) AS cnt FROM accessLogs
          WHERE pathname = '/' AND durationSec IS NOT NULL AND durationSec > 0
        `);
        const avgDurMvp = await db.execute(sql`
          SELECT AVG(durationSec) AS avg, COUNT(*) AS cnt FROM accessLogs
          WHERE pathname = '/mvp' AND durationSec IS NOT NULL AND durationSec > 0
        `);
        const s1 = Number(((step1[0] as unknown) as any[])[0]?.cnt || 0);
        const s2 = Number(((step2[0] as unknown) as any[])[0]?.cnt || 0);
        const s3 = Number(((step3[0] as unknown) as any[])[0]?.cnt || 0);
        const avgLanding = Math.round(Number(((avgDurLanding[0] as unknown) as any[])[0]?.avg || 0));
        const avgMvp = Math.round(Number(((avgDurMvp[0] as unknown) as any[])[0]?.avg || 0));
        return {
          funnel: [
            { step: "보러가기 클릭", count: s1, rate: 100 },
            { step: "MVP 지도 접속", count: s2, rate: s1 > 0 ? Math.round((s2 / s1) * 100) : 0 },
            { step: "GPS 허용", count: s3, rate: s2 > 0 ? Math.round((s3 / s2) * 100) : 0 },
          ],
          avgDuration: {
            landing: avgLanding,
            mvp: avgMvp,
          },
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

  // User spots - real user markers on the map
  spot: router({
    // Submit a new spot (called from MvpMap after user fills in MBTI/MOOD/MODE/SIGN)
    submit: publicProcedure
      .input(
        z.object({
          mbti: z.string().min(1).max(8),
          mood: z.string().min(1).max(64),
          mode: z.string().min(1).max(64),
          sign: z.string().min(1).max(128),
          lat: z.number(),
          lng: z.number(),
          avatar: z.string().max(512).optional(), // JSON string of AvatarConfig
          activity: z.string().max(128).optional(), // JSON string of { emoji, text }
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

          // IP whitelist - skip saving for owner's devices
          const IP_WHITELIST = [
            "221.141.9.83",
            "112.221.224.125",
            "211.235.89.25",
            "2001:2d8:71a3:b0c2:2c69:8653:d08a:4d8f",
            "2001:2d8:2183:48bf::6089:339b",
            "::ffff:127.0.0.1",
            "127.0.0.1",
            "::1",
          ];

          const { insertUserSpot } = await import("./db");
          await insertUserSpot({
            mbti: input.mbti.toUpperCase(),
            mood: input.mood,
            mode: input.mode,
            sign: input.sign,
            lat: input.lat,
            lng: input.lng,
            ipAddress: IP_WHITELIST.includes(ipAddress) ? null : ipAddress,
            avatar: input.avatar ?? null,
            activity: input.activity ?? null,
          });

          // Log the spot submission event
          try {
            const { eventLogs } = await import("../drizzle/schema");
            await db.insert(eventLogs).values({
              ipAddress: IP_WHITELIST.includes(ipAddress) ? "owner" : ipAddress,
              eventName: "spot_submitted",
              page: "/mvp",
            });
          } catch (_) {}

          return { success: true };
        } catch (error) {
          console.error("[Spot] Failed to submit:", error);
          return { success: false };
        }
      }),

    // Get all spots for map display
    getAll: publicProcedure.query(async () => {
      try {
        const { getAllUserSpots } = await import("./db");
        const spots = await getAllUserSpots();
        return { spots };
      } catch (error) {
        console.error("[Spot] Failed to get all:", error);
        return { spots: [] };
      }
    }),
  }),

  // Seoul City Realtime Data API proxy
  citydata: router({
    // Get realtime crowd data for a district
    // area: '연남동' | '성수카페거리' | '홍대앞'
    getDistrict: publicProcedure
      .input(z.object({ area: z.string().min(1).max(50) }))
      .query(async ({ input }) => {
        try {
          const key = '4c4263544469737333305778577771';
          const encoded = encodeURIComponent(input.area);
          const url = `http://openapi.seoul.go.kr:8088/${key}/json/citydata/1/1/${encoded}`;
          const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json() as any;
          if (!data.CITYDATA) throw new Error('No CITYDATA in response');
          const cd = data.CITYDATA;
          const ppltn = cd.LIVE_PPLTN_STTS?.[0] ?? {};
          const weather = cd.WEATHER_STTS?.[0] ?? {};
          return {
            success: true,
            areaNm: cd.AREA_NM as string,
            areaCd: cd.AREA_CD as string,
            congestLvl: (ppltn.AREA_CONGEST_LVL ?? '') as string,
            congestMsg: (ppltn.AREA_CONGEST_MSG ?? '') as string,
            ppltnMin: Number(ppltn.AREA_PPLTN_MIN ?? 0),
            ppltnMax: Number(ppltn.AREA_PPLTN_MAX ?? 0),
            malePpltnRate: Number(ppltn.MALE_PPLTN_RATE ?? 50),
            femalePpltnRate: Number(ppltn.FEMALE_PPLTN_RATE ?? 50),
            temp: Number(weather.TEMP ?? 0),
            humidity: Number(weather.HUMIDITY ?? 0),
            windSpd: Number(weather.WIND_SPD ?? 0),
            precipitation: (weather.PRECIPITATION ?? '0') as string,
            pcpMsg: (weather.PCP_MSG ?? '') as string,
            uvIndexLvl: (weather.UV_INDEX_LVL ?? '') as string,
            updatedAt: new Date().toISOString(),
          };
        } catch (error) {
          console.error('[CityData] Failed:', error);
          return { success: false, areaNm: input.area, congestLvl: '', ppltnMin: 0, ppltnMax: 0, temp: 0, updatedAt: new Date().toISOString() };
        }
      }),

    // Get AI-generated atmosphere report for a district
    getAtmosphereReport: publicProcedure
      .input(z.object({ area: z.string().min(1).max(50), areaKr: z.string().min(1).max(20) }))
      .query(async ({ input }) => {
        try {
          const { invokeLLM } = await import('./_core/llm');
          // Fetch live data first
          const key = '4c4263544469737333305778577771';
          const encoded = encodeURIComponent(input.area);
          const url = `http://openapi.seoul.go.kr:8088/${key}/json/citydata/1/1/${encoded}`;
          let cityCtx = '';
          try {
            const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
            if (res.ok) {
              const data = await res.json() as any;
              const cd = data.CITYDATA;
              const ppltn = cd?.LIVE_PPLTN_STTS?.[0] ?? {};
              const weather = cd?.WEATHER_STTS?.[0] ?? {};
              cityCtx = `현재 혼잡도: ${ppltn.AREA_CONGEST_LVL ?? '정보없음'}, 인구: ${ppltn.AREA_PPLTN_MIN ?? '?'}~${ppltn.AREA_PPLTN_MAX ?? '?'}명, 기온: ${weather.TEMP ?? '?'}°C, 습도: ${weather.HUMIDITY ?? '?'}%, 강수: ${weather.PCP_MSG ?? '없음'}`;
            }
          } catch (_) {}
          const now = new Date();
          const hour = now.getHours();
          const timeCtx = hour < 6 ? '새벽' : hour < 12 ? '오전' : hour < 18 ? '오후' : hour < 22 ? '저녁' : '밤';
          const response = await invokeLLM({
            messages: [
              { role: 'system', content: '당신은 서울의 핫플레이스 분위기를 감각적으로 묘사하는 에디터입니다. 짧고 감성적인 문장으로 지금 이 순간의 공간 분위기를 전달하세요. 반드시 한국어로 답하세요.' },
              { role: 'user', content: `지금 ${timeCtx} ${input.areaKr}의 분위기를 알려주세요.\n실시간 데이터: ${cityCtx || '데이터 없음'}\n\n다음 형식으로 답하세요:\n- 한 줄 분위기 요약 (20자 이내, 감성적)
- 지금 이 곳에 있다면 어떤 느낌인지 (2-3문장)
- 지금 어울리는 활동 3가지 (해시태그 형식)` },
            ],
          });
          const content = response.choices?.[0]?.message?.content ?? '분위기 데이터를 불러오는 중입니다.';
          return { success: true, report: content, cityCtx, updatedAt: new Date().toISOString() };
        } catch (error) {
          console.error('[AtmosphereReport] Failed:', error);
          return { success: false, report: '잠시 후 다시 시도해주세요.', cityCtx: '', updatedAt: new Date().toISOString() };
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

  // Kakao Map API proxy (server-side to hide REST API key)
  kakao: router({
    // Keyword search for places
    searchKeyword: publicProcedure
      .input(z.object({ query: z.string().min(1).max(80), x: z.string().optional(), y: z.string().optional() }))
      .query(async ({ input }) => {
        try {
          const key = process.env.KAKAO_REST_API_KEY || '';
          if (!key) return { success: false, documents: [] };
          const params = new URLSearchParams({ query: input.query, size: '5' });
          if (input.x) params.set('x', input.x);
          if (input.y) params.set('y', input.y);
          const url = `https://dapi.kakao.com/v2/local/search/keyword.json?${params}`;
          const res = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` }, signal: AbortSignal.timeout(5000) });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json() as any;
          return {
            success: true,
            documents: (data.documents || []).map((d: any) => ({
              name: d.place_name,
              address: d.road_address_name || d.address_name,
              lat: parseFloat(d.y),
              lng: parseFloat(d.x),
              category: d.category_group_code,
            })),
          };
        } catch (error) {
          console.error('[Kakao Search] Failed:', error);
          return { success: false, documents: [] };
        }
      }),

    // Address search
    searchAddress: publicProcedure
      .input(z.object({ query: z.string().min(1).max(80) }))
      .query(async ({ input }) => {
        try {
          const key = process.env.KAKAO_REST_API_KEY || '';
          if (!key) return { success: false, documents: [] };
          const params = new URLSearchParams({ query: input.query });
          const url = `https://dapi.kakao.com/v2/local/search/address.json?${params}`;
          const res = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` }, signal: AbortSignal.timeout(5000) });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json() as any;
          return {
            success: true,
            documents: (data.documents || []).map((d: any) => ({
              name: d.address_name,
              address: d.address_name,
              lat: parseFloat(d.y),
              lng: parseFloat(d.x),
            })),
          };
        } catch (error) {
          console.error('[Kakao Address] Failed:', error);
          return { success: false, documents: [] };
        }
      }),

    // Reverse geocoding (coord → address)
    reverseGeocode: publicProcedure
      .input(z.object({ lat: z.number(), lng: z.number() }))
      .query(async ({ input }) => {
        try {
          const key = process.env.KAKAO_REST_API_KEY || '';
          if (!key) return { success: false, address: '' };
          const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${input.lng}&y=${input.lat}`;
          const res = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` }, signal: AbortSignal.timeout(5000) });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json() as any;
          const doc = data.documents?.[0];
          if (!doc) return { success: false, address: '' };
          const addr = doc.road_address?.address_name || doc.address?.address_name || '';
          return { success: true, address: addr };
        } catch (error) {
          console.error('[Kakao ReverseGeocode] Failed:', error);
          return { success: false, address: '' };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
