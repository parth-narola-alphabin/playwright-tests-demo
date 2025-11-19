// // tests/login.spec.js
// const { test, expect } = require('@playwright/test');

// const TEST_EMAIL = process.env.TEST_USER_EMAIL || "test@example.com";
// const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || "Test@12345";

// test.describe("Login Tests (JavaScript)", () => {

//   test.beforeEach(async ({ page }) => {
//     await page.goto('/');
//   });

//   test("Successful login with valid credentials", async ({ page }) => {
//     // Click Login button
//     await page.getByRole('link', { name: /login|sign in/i }).click();

//     // Enter credentials
//     await page.getByRole('textbox', { name: /email/i }).fill(TEST_EMAIL);
//     await page.getByRole('textbox', { name: /password/i }).fill(TEST_PASSWORD);

//     // Login button click
//     await page.getByRole('button', { name: /login|sign in/i }).click();

//     // Expect redirect
//     await expect(page).toHaveURL(/dashboard|account|profile/i);

//     // Expect logout button exists
//     await expect(
//       page.getByRole('button', { name: /logout|sign out/i })
//     ).toBeVisible();
//   });

//   test("Login fails with incorrect password", async ({ page }) => {
//     await page.getByRole('link', { name: /login|sign in/i }).click();

//     await page.getByRole('textbox', { name: /email/i }).fill(TEST_EMAIL);
//     await page.getByRole('textbox', { name: /password/i }).fill("WrongPassword123");

//     await page.getByRole('button', { name: /login|sign in/i }).click();

//     await expect(
//       page.getByText(/invalid|incorrect|wrong|failed/i)
//     ).toBeVisible();
//   });

//   test("Validation messages for empty fields", async ({ page }) => {
//     await page.getByRole('link', { name: /login|sign in/i }).click();

//     await page.getByRole('button', { name: /login|sign in/i }).click();

//     await expect(
//       page.getByText(/required|enter email|enter password/i)
//     ).toBeVisible();
//   });

// });
