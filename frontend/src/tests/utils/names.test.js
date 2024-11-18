import { describe, test, expect } from "vitest";
import { generateName, adjectives, names } from "../../utils/names";

describe("generateName", () => {
    test("should return a string in the format 'adjective-animal'", () => {
        const name = generateName();
        const regex = /^[a-z]+-[a-z-]+$/i;
        expect(regex.test(name)).toBe(true);
    });

    test("should return an adjective from the adjectives array", () => {
        const name = generateName();
        const [adjective] = name.split("-");
        expect(adjectives.includes(adjective)).toBe(true);
    });

    test("should return an animal from the names array", () => {
        const name = generateName();
        const animal = name.split("-")[1];
        const validAnimals = names.map(n => n.replace(" ", "-"));
        expect(validAnimals.includes(animal)).toBe(true);
    });

    test("should generate different names over multiple calls", () => {
        const uniqueNames = new Set();
        for (let i = 0; i < 100; i++) {
            uniqueNames.add(generateName());
        }
        expect(uniqueNames.size).toBeGreaterThan(1);
    });

    test("should replace spaces in animal names with hyphens", () => {
        for (let i = 0; i < 100; i++) {
            const name = generateName();
            expect(name).not.toContain(" ");
        }
    });

    test("should return a string", () => {
        for (let i = 0; i < 100; i++) {
            expect(typeof generateName()).toBe("string");
        }
    });
});