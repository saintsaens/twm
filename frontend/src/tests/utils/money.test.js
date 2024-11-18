import { describe, test, expect } from "vitest";
import { parseMoney, formatCurrency } from "../../utils/money";

describe("parseMoney", () => {
    test("parses valid money strings", () => {
        expect(parseMoney("$1,234.56")).toBe(1234.56);
        expect(parseMoney("1234.56")).toBe(1234.56);
    });

    test("handles negative values", () => {
        expect(parseMoney("-$1,234.56")).toBe(-1234.56);
    });

    test("returns NaN for invalid inputs", () => {
        expect(parseMoney("abc")).toBeNaN();
        expect(parseMoney(null)).toBeNaN();
        expect(parseMoney("")).toBeNaN();
    });
});

describe("formatCurrency", () => {
    test("formats valid numbers as USD", () => {
        expect(formatCurrency(1234.56)).toBe("$1,234.56");
        expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
        expect(formatCurrency(0)).toBe("$0.00");
    });

    test("formats large numbers", () => {
        expect(formatCurrency(123456789)).toBe("$123,456,789.00");
    });

    test("handles floats with many decimals", () => {
        expect(formatCurrency(1234.5678)).toBe("$1,234.57"); // Rounds correctly
    });
});