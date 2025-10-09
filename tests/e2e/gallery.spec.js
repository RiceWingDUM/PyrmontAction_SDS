import { test, expect } from "@playwright/test";

test.describe("Gallery Feature E2E", () => {

    // Check if gallery page loads and displays images
    test("should display all gallery images", async ({ page }) => {
        await page.goto("http://localhost:5173/gallery");
        const galleryImages = page.locator(".collage-item img");

        // Assert that at least one image is visible
        await expect(galleryImages.first()).toBeVisible({ timeout: 5000 });
        await expect(galleryImages).toHaveCountGreaterThan(0);
    });
});