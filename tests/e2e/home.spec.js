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

    // Test to check if clicking left arrow moves to previous slide
    test("should move to previous slide when clicking left arrow", async ({ page }) => {
        const rightArrow = page.locator(".toggle-page.right i");
        const leftArrow = page.locator(".toggle-page.left i");

        // Move to slide 2 first
        await rightArrow.click();

        // Then go back to slide 1
        await leftArrow.click();
        const firstActive = page.locator(".pagination span.active:nth-child(1)");

        // Assert that the first dot is active again
        await expect(firstActive).toBeVisible();
    });

    test("should cycle back to first slide after last", async ({ page }) => {
        const rightArrow = page.locator(".toggle-page.right i");

        // Click enough times to loop
        await rightArrow.click();
        await rightArrow.click();
        await rightArrow.click();

        const firstActive = page.locator(".pagination span.active:nth-child(1)");

        // Assert that the first dot is active again
        await expect(firstActive).toBeVisible();
    });

    // Test workflow functionality of random click on dot navigation
    test("should jump to correct slide when pagination dot is clicked", async ({ page }) => {
        const secondDot = page.locator(".pagination span:nth-child(2)");
        await secondDot.click();

        const secondActive = page.locator(".pagination span.active:nth-child(2)");

        // Assert that the second dot is active
        await expect(secondActive).toBeVisible();
    });
});