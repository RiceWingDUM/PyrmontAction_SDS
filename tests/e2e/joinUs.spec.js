import { test, expect } from '@playwright/test';
// import { LoginPage } from "../../pages/login/loginPage";

test('registration test without page object', async ({ page }) => {
  await page.goto('http://localhost:5173/joinus'); // replace with actual join us page route

  // Fill Login Details
  const uniqueEmail = `testuser_${Date.now()}@example.com`;

  await page.locator('#email').fill(uniqueEmail);
  await page.locator('#password').fill('Password123!');

  // Fill Personal Details
  await page.locator('#first-name').fill('John');
  await page.locator('#last-name').fill('Doe');
  await page.locator('#mobile-phone').fill('0412345678');
  await page.locator('#areaOfInterestTextArea').fill('Community Engagement');

  // Fill Address Details
  await page.locator('#street-name').fill('123 Example Street');
  await page.locator('#city').fill('Sydney');
  await page.locator('#state').selectOption('NSW'); 
  await page.locator('#postcode').fill('2000');

  // Submit the form
  await page.locator('#submitBtn').click();

  // Wait for network call to backend (adjust URL if needed)
  // const response = await page.waitForResponse(res =>
  //   res.url().includes('/joinus') && res.status() === 200
  // );

  // Assert successful redirect to login page
  await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
  // await page.goto('http://localhost:5173/login'); // replace with actual login page route
  // await expect(page.locator('#welcome-heading')).toHaveText('Welcome back');
});

test('password validation updates as user types', async ({ page }) => {
  await page.goto('http://localhost:5173/joinus');

  const passwordInput = page.locator('#password');

  // Initially, all rules should be unfulfilled
  await expect(page.locator('li:has-text("At least 10 characters")')).not.toHaveClass(/password-accept/);

  // Type 10 characters
  await passwordInput.fill('abcdefghij');
  await expect(page.locator('li:has-text("At least 10 characters")')).toHaveClass(/password-accept/);
  await expect(page.locator('li:has-text("At least one upper-case letter")')).not.toHaveClass(/password-accept/);

  // Add uppercase letter
  await passwordInput.fill('Abcdefghij');
  await expect(page.locator('li:has-text("At least one upper-case letter")')).toHaveClass(/password-accept/);

  // Add digit
  await passwordInput.fill('Abcdefghij1');
  await expect(page.locator('li:has-text("At least one digit")')).toHaveClass(/password-accept/);

  // Add symbol
  await passwordInput.fill('Abcdefghij1!');
  await expect(page.locator('li:has-text("At least one symbol")')).toHaveClass(/password-accept/);
});

// Test 3: Check missing required fields flagged
test('Join Us form should show errors for missing required fields', async ({ page }) => {
  await page.goto('http://localhost:5173/joinUs');

  await page.click('#submitBtn');

  await expect(page.locator("#email + .error-message")).toHaveText("Email is required");
  await expect(page.locator("#password + .error-message")).toHaveText("Password is required");
  await expect(page.locator("#first-name + .error-message")).toHaveText("First name is required");
});

// Test 4: Invalid email format
test("Join Us form should reject invalid email", async ({ page }) => {
  await page.goto("http://localhost:5173/joinus");

  await page.fill("#email", "invalidEmail.com");
  await page.fill("#password", "ValidPass123!");
  await page.click("#submitBtn");

  await expect(page.locator("#email + .error-message")).toHaveText("Please enter a valid email address that contains '@'. For example: example@example.com");
});

// Test 5: Weak password --> Requirements stay red
test("Password requirements turn red if not met", async ({ page }) => {
  await page.goto("http://localhost:5173/joinus");

  await page.fill("#password", "weak");

  await expect(page.locator("li:has-text('At least 10 characters')")).not.toHaveClass(/password-accept/);
  await expect(page.locator("li:has-text('At least one upper-case letter')")).not.toHaveClass(/password-accept/);
});

// Error message for Invalid mobile number: Please enter a valid mobile phone number that begins with the digits 0 and 4. For example: 0411 222 333

// http://localhost:5173/member
// 