// Testing Footer
// tests/e2e/footer.spec.js
import { test, expect } from "@playwright/test";

test.describe("Footer Component", () => {

    // Check if footer content is displayed on homepage
    test("renders footer sections on homepage", async ({ page }) => {
    await page.goto("http://localhost:5173/"); // replace with your dev server port

    const footer = page.locator(".footer");
    await expect(footer).toBeVisible();

    await expect(footer.locator("text=Our Partners")).toBeVisible();
    await expect(footer.locator("text=Gallery")).toBeVisible();
    await expect(footer.locator("text=Contact Us")).toBeVisible();
  });

  // Check if partner links open in new tabs
  test("displays partner links that open in new tabs", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    const footer = page.locator(".footer");
    const landcareLink = footer.locator("a[href*='pyrmontultimolandcare']");
    await expect(landcareLink).toHaveAttribute("target", "_blank");
  });

  // Check if contact info is correct in footer section
  test("contains correct contact email and phone", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await expect(page.locator("text=convenor@pyrmontaction.org.au")).toBeVisible();
    await expect(page.locator("text=(+61) 414 997 089")).toBeVisible();
  });
});