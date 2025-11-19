// @ts-check
import { test, expect } from '@playwright/test';

test('has-correct-title', async ({ page }) => {
  await page.goto('https://demo.alphabin.co/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AB | Demo Store/);
});

test('should-filter-product-and-reset-successfully', async ({ page }) => {
  await page.goto('https://demo.alphabin.co/');

  await page.getByRole('link', { name: 'Shop Now' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page).toHaveURL('https://demo.alphabin.co/products');

  await page.getByTestId('all-products-filter-icon').click();

  await page.getByTestId('all-products-category-select').selectOption('Uncategorized');

  await page.getByTestId('all-products-reset-all-filters-button').click();

  await page.getByTestId('all-products-filter-icon').click();

});


test('should-product-add-to-cart', async ({ page }) => {
  await page.goto('https://demo.alphabin.co/');

  await page.getByRole('link', { name: 'Shop Now' }).click();

  await page.getByTestId('all-products-header').first().click();

  await expect(page.getByTestId('product-name')).toHaveText('Rode NT1-A Condenser Mic');

  await page.getByTestId('add-to-cart-button').click();

  await expect(page.getByTestId('cart-item')).toBeVisible;
  
});

test('should-product-add-to-wishlist', async ({ page }) => {
  await page.goto('https://demo.alphabin.co/');

  await page.getByRole('link', { name: 'Shop Now' }).click();

  await page.getByTestId('all-products-wishlist-button').first().click();

  const count = page.getByTestId('header-wishlist-count');
  await expect(count).toContainText('1');
});

const TEST_EMAIL = process.env.TEST_USER_EMAIL || "parth.alphabin@gmail.com";
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || "Parth@321";

test('should-login-successfully', async ({ page }) => {
  await page.goto('https://demo.alphabin.co/');

  await page.getByTestId('header-user-icon').click()

  await page.getByTestId('login-email-input').fill(TEST_EMAIL)

  await page.getByTestId('login-password-input').fill(TEST_PASSWORD)

  await page.getByTestId('login-submit-button').click()

  await expect(page.getByText('Logged in successfully')).toBeVisible({ timeout:30000 })

});   

test('should-login-with-incorrect-password', async ({ page }) => {
  await page.goto('https://demo.alphabin.co/');

  await page.getByTestId('header-user-icon').click()

  await page.getByTestId('login-email-input').fill(TEST_EMAIL)

  await page.getByTestId('login-password-input').fill('wrong123')

  await page.getByTestId('login-submit-button').click()

  await expect(page.getByText('Invalid credentials')).toBeVisible({ timeout:30000 })

});     

test('should-login-with-empty-field', async ({ page }) => {
  await page.goto('https://demo.alphabin.co/');

  await page.getByTestId('header-user-icon').click()

  await page.getByTestId('login-submit-button').click()

  await expect(page.getByTestId('login-email-error')).toBeVisible()

  await expect(page.getByTestId('login-password-error')).toBeVisible()

});     

test('should-logout-successfully', async ({ page }) => {
  await page.goto('https://demo.alphabin.co/');

  await page.getByTestId('header-user-icon').click()

  await page.getByTestId('login-email-input').fill(TEST_EMAIL)

  await page.getByTestId('login-password-input').fill(TEST_PASSWORD)

  await page.getByTestId('login-submit-button').click()

  await expect(page.getByText('Logged in successfully')).toBeVisible({ timeout:30000 })


  await page.getByTestId('header-user-icon').click()

  const logoutButton = page.getByTestId('menu-item-label').filter({ hasText: 'Log out' })
  await expect(logoutButton).toBeVisible()
  await logoutButton.click()


}); 