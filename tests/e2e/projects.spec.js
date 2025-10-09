import { test, expect } from "@playwright/test";

test.describe("Projects Page - Search Functionality", () => {
    // Navigate to projects page before each test
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/projects/open");
    });

    // Firstly, check if all projects are displayed initially in projects page
    test("displays all projects initially", async ({ page }) => {
        const cards = page.locator(".project-card");

        const cardCount = await cards.count();

        // Assert that there is at least one project card
        expect(cardCount).toBeGreaterThan(0);
        // await expect(cards).toHaveCountGreaterThan(0);
    });
});