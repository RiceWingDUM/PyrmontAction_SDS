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

    // Verify if search input filters projects correctly
    test("filters projects based on search input", async ({ page }) => {
        const searchBox = page.locator("input.textbox");
        await searchBox.fill("cleanup");

        const cards = page.locator(".project-card");

        // Assert that only relevant project cards are displayed
        await expect(cards).toHaveCount(1);
        await expect(cards.first().locator(".project-card__title")).toContainText("Cleanup");
    });
});