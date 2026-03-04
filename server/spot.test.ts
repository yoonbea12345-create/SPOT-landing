import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  getDb: vi.fn(),
  insertUserSpot: vi.fn(),
  getAllUserSpots: vi.fn(),
}));

import { getDb, insertUserSpot, getAllUserSpots } from "./db";

function createPublicContext(ip = "1.2.3.4"): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {
        "x-forwarded-for": ip,
        "user-agent": "test-agent",
      },
      socket: { remoteAddress: ip },
    } as unknown as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("spot.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success: false when DB is unavailable", async () => {
    (getDb as any).mockResolvedValue(null);
    (insertUserSpot as any).mockRejectedValue(new Error("Database not available"));
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.spot.submit({
      mbti: "ENFP",
      mood: "HAPPY",
      mode: "산책 중",
      sign: "모두 안녕하세요",
      lat: 37.5566,
      lng: 126.9236,
    });
    expect(result).toEqual({ success: false });
  });

  it("inserts spot and returns success: true when DB is available", async () => {
    const mockInsert = {
      values: vi.fn().mockResolvedValue(undefined),
    };
    const mockDb = {
      insert: vi.fn().mockReturnValue(mockInsert),
    };
    (getDb as any).mockResolvedValue(mockDb);
    (insertUserSpot as any).mockResolvedValue(undefined);

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.spot.submit({
      mbti: "ENFP",
      mood: "HAPPY",
      mode: "산책 중",
      sign: "모두 안녕하세요",
      lat: 37.5566,
      lng: 126.9236,
    });
    expect(result).toEqual({ success: true });
    expect(insertUserSpot).toHaveBeenCalledWith(
      expect.objectContaining({
        mbti: "ENFP",
        mood: "HAPPY",
        mode: "산책 중",
        sign: "모두 안녕하세요",
        lat: 37.5566,
        lng: 126.9236,
      })
    );
  });

  it("converts mbti to uppercase before saving", async () => {
    const mockInsert = {
      values: vi.fn().mockResolvedValue(undefined),
    };
    const mockDb = {
      insert: vi.fn().mockReturnValue(mockInsert),
    };
    (getDb as any).mockResolvedValue(mockDb);
    (insertUserSpot as any).mockResolvedValue(undefined);

    const caller = appRouter.createCaller(createPublicContext());
    await caller.spot.submit({
      mbti: "enfp",
      mood: "HAPPY",
      mode: "산책 중",
      sign: "모두 안녕하세요",
      lat: 37.5566,
      lng: 126.9236,
    });
    expect(insertUserSpot).toHaveBeenCalledWith(
      expect.objectContaining({ mbti: "ENFP" })
    );
  });

  it("does not save ipAddress for whitelisted IPs", async () => {
    const mockInsert = {
      values: vi.fn().mockResolvedValue(undefined),
    };
    const mockDb = {
      insert: vi.fn().mockReturnValue(mockInsert),
    };
    (getDb as any).mockResolvedValue(mockDb);
    (insertUserSpot as any).mockResolvedValue(undefined);

    const caller = appRouter.createCaller(createPublicContext("221.141.9.83"));
    await caller.spot.submit({
      mbti: "INTJ",
      mood: "CHILL",
      mode: "카페 탐방",
      sign: "테스트",
      lat: 37.5566,
      lng: 126.9236,
    });
    expect(insertUserSpot).toHaveBeenCalledWith(
      expect.objectContaining({ ipAddress: null })
    );
  });
});

describe("spot.getAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array when DB is unavailable", async () => {
    (getAllUserSpots as any).mockResolvedValue([]);
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.spot.getAll();
    expect(result).toEqual({ spots: [] });
  });

  it("returns all spots from DB", async () => {
    const mockSpots = [
      { id: 1, mbti: "ENFP", mood: "HAPPY", mode: "산책 중", sign: "안녕", lat: 37.5, lng: 126.9, ipAddress: null, createdAt: new Date() },
      { id: 2, mbti: "INTJ", mood: "CHILL", mode: "카페", sign: "조용히", lat: 37.6, lng: 127.0, ipAddress: null, createdAt: new Date() },
    ];
    (getAllUserSpots as any).mockResolvedValue(mockSpots);

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.spot.getAll();
    expect(result.spots).toHaveLength(2);
    expect(result.spots[0].mbti).toBe("ENFP");
  });
});
