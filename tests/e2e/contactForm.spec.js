import { test, expect } from "@playwright/test";

test.describe("End-to-End tests for Contact Form", () => {

    // Check if contact form fields render correctly
    test("renders all fields correctly", async ({ page }) => {
        await page.goto("http://localhost:5173/contact");
        await expect(page.locator("#firstName")).toBeVisible();
        await expect(page.locator("#email")).toBeVisible();
    });

    // Validate submission attempt with empty contact form fields to show errors
    test("displays validation errors when submitting empty form", async ({ page }) => {
        await page.goto("http://localhost:5173/contact");
        await page.click(".submit-btn");
        await expect(page.locator(".error-message")).toBeVisible();
    });
});