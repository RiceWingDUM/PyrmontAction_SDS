import { test, expect } from "@playwright/test";

test.describe("Projects Page - Search Functionality", () => {
    // Navigate to projects page before each test
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/projects/open");
    });

});