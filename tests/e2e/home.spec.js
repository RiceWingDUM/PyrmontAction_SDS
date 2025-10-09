import { test, expect } from "@playwright/test";

test.describe("Carousel UI Behavior", () => {
    
    // Navigate to homepage before each test
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/"); // your local dev URL
    });

    // Verify if dots and 1st slide are visible on homepage
    test("should display pagination dots and first slide active by default", async ({ page }) => {
        const activeDot = page.locator(".pagination .active");

        // Assert that the first dot is active
        await expect(activeDot).toBeVisible();
    });

    // Test to check if clicking right arrow moves to next slide
    test("should move to next slide when clicking right arrow", async ({ page }) => {
        const rightArrow = page.locator(".toggle-page.right i");
        await rightArrow.click();
        const secondActive = page.locator(".pagination span.active:nth-child(2)");

        // Assert that the second dot is now active
        await expect(secondActive).toBeVisible();
    });
});