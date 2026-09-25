import { describe, expect, it } from "vitest";
import { canChiOfBirthDate, canChiOfLunarYear } from "./can-chi";
import { solarToLunar } from "./lunar";

const d = (day: number, month: number, year: number) => ({ day, month, year });

describe("solarToLunar (múi giờ Việt Nam)", () => {
  it.each([
    [d(17, 2, 2026), 2026],
    [d(6, 2, 2027), 2027],
    [d(29, 1, 2025), 2025],
    [d(10, 2, 2024), 2024],
    [d(5, 2, 2000), 2000],
    // Tết 1985 ở Việt Nam sớm hơn Trung Quốc một tháng — kiểm tra đúng múi giờ UTC+7
    [d(21, 1, 1985), 1985],
  ])("Tết: %o là mùng 1 tháng Giêng năm %i", (date, year) => {
    expect(solarToLunar(date)).toEqual({ day: 1, month: 1, year, isLeapMonth: false });
  });

  it("ngày trước Tết vẫn thuộc năm âm lịch cũ", () => {
    const lunar = solarToLunar(d(16, 2, 2026));
    expect(lunar.year).toBe(2025);
    expect(lunar.month).toBe(12);
  });

  it.each([
    [d(22, 3, 2023), 2, 2023],
    [d(23, 5, 2020), 4, 2020],
  ])("tháng nhuận: %o là mùng 1 tháng %i nhuận năm %i", (date, month, year) => {
    expect(solarToLunar(date)).toEqual({ day: 1, month, year, isLeapMonth: true });
  });
});

describe("can chi & nạp âm", () => {
  it.each([
    [1984, "Giáp Tý", "Chuột", "Hải Trung Kim", "Kim"],
    [1990, "Canh Ngọ", "Ngựa", "Lộ Bàng Thổ", "Thổ"],
    [1995, "Ất Hợi", "Lợn", "Sơn Đầu Hỏa", "Hỏa"],
    [1999, "Kỷ Mão", "Mèo", "Thành Đầu Thổ", "Thổ"],
    [2000, "Canh Thìn", "Rồng", "Bạch Lạp Kim", "Kim"],
    [2003, "Quý Mùi", "Dê", "Dương Liễu Mộc", "Mộc"],
    [2026, "Bính Ngọ", "Ngựa", "Thiên Hà Thủy", "Thủy"],
    [2027, "Đinh Mùi", "Dê", "Thiên Hà Thủy", "Thủy"],
  ])("năm %i là %s (%s), mệnh %s", (year, label, animal, napAm, element) => {
    const cc = canChiOfLunarYear(year);
    expect(cc.label).toBe(label);
    expect(cc.animal).toBe(animal);
    expect(cc.napAm).toBe(napAm);
    expect(cc.element).toBe(element);
  });

  it("con giáp tính theo Tết chứ không theo 1/1 dương lịch", () => {
    expect(canChiOfBirthDate(d(15, 1, 2000)).label).toBe("Kỷ Mão");
    expect(canChiOfBirthDate(d(15, 2, 2000)).label).toBe("Canh Thìn");
  });
});
