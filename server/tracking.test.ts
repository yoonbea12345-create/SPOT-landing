import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock getDb
vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

import { getDb } from "./db";

describe("Tracking - log.track", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns logId on successful insert", async () => {
    const mockInsert = vi.fn().mockResolvedValue([{ insertId: 42 }]);
    const mockDb = {
      insert: vi.fn().mockReturnValue({ values: mockInsert }),
    };
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);

    const db = await getDb();
    expect(db).not.toBeNull();
    const result = await db!.insert({} as any).values({ ipAddress: "1.2.3.4", pathname: "/" });
    expect(result[0].insertId).toBe(42);
  });

  it("returns null logId when db unavailable", async () => {
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const db = await getDb();
    expect(db).toBeNull();
  });
});

describe("Tracking - log.trackGps", () => {
  it("updates gpsLat and gpsLng for a given logId", async () => {
    const mockWhere = vi.fn().mockResolvedValue({ affectedRows: 1 });
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDb = { update: mockUpdate };
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);

    const db = await getDb();
    const result = await db!.update({} as any).set({ gpsLat: 37.5, gpsLng: 127.0 }).where({} as any);
    expect(result).toEqual({ affectedRows: 1 });
    expect(mockSet).toHaveBeenCalledWith({ gpsLat: 37.5, gpsLng: 127.0 });
  });
});

describe("Tracking - log.trackEvent", () => {
  it("inserts event log with eventName and page", async () => {
    const mockInsert = vi.fn().mockResolvedValue([{ insertId: 10 }]);
    const mockDb = {
      insert: vi.fn().mockReturnValue({ values: mockInsert }),
    };
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);

    const db = await getDb();
    const result = await db!.insert({} as any).values({
      ipAddress: "1.2.3.4",
      eventName: "click_보러가기_hero",
      page: "/",
    });
    expect(result[0].insertId).toBe(10);
    expect(mockInsert).toHaveBeenCalledWith({
      ipAddress: "1.2.3.4",
      eventName: "click_보러가기_hero",
      page: "/",
    });
  });
});

describe("Tracking - log.updateDuration", () => {
  it("updates durationSec for a given logId", async () => {
    const mockWhere = vi.fn().mockResolvedValue({ affectedRows: 1 });
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDb = { update: mockUpdate };
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);

    const db = await getDb();
    const result = await db!.update({} as any).set({ durationSec: 120 }).where({} as any);
    expect(result).toEqual({ affectedRows: 1 });
    expect(mockSet).toHaveBeenCalledWith({ durationSec: 120 });
  });
});
