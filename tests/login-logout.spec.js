import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'parth.alphabin@gmail.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'Parth@321';

test.describe('Auth smoke - demo.alphabin.co', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.alphabin.co/');
  });

  test('user can login for the first time and logout', async ({ page }) => {
    await page.getByTestId('header-user-icon').click();

    await page.getByTestId('login-email-input').fill(TEST_EMAIL);
    await page.getByTestId('login-password-input').fill(TEST_PASSWORD);
    await page.getByTestId('login-submit-button').click();

    await expect(page.getByText('Logged in successfully')).toBeVisible({ timeout: 30_000 });

    await page.getByTestId('header-user-icon').click();
    const logoutButton = page.getByTestId('menu-item-label').filter({ hasText: 'Log out' });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    await expect(page.getByText('Logged out successfully')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('login-submit-button')).toBeVisible();
  });
});


