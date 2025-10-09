import { test, expect } from "@playwright/test";

test.describe("Carousel UI Behavior", () => {
    
    // Navigate to homepage before each test
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/"); // your local dev URL
    });
});