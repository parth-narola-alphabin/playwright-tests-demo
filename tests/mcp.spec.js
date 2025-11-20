import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'parth.alphabin@gmail.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'Parth@321';

async function login(page) {
  await page.getByTestId('header-user-icon').click();
  await page.getByTestId('login-email-input').fill(TEST_EMAIL);
  await page.getByTestId('login-password-input').fill(TEST_PASSWORD);
  await page.getByTestId('login-submit-button').click();
  await expect(page.getByText('Logged in successfully')).toBeVisible({ timeout: 30_000 });
}

async function openProductGrid(page) {
  await page.getByRole('link', { name: 'Shop Now' }).click();
  await expect(page).toHaveURL(/\/products/);
}

async function openFirstProductDetails(page) {
  await openProductGrid(page);
  const firstProduct = page.getByTestId('all-products-header').first();
  await expect(firstProduct).toBeVisible();
  const name = (await firstProduct.textContent())?.trim() ?? '';
  await firstProduct.click();
  await expect(page.getByTestId('product-name')).toBeVisible();
  return name;
}

test.describe('MCP critical flows - demo.alphabin.co', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('MCP01 - hero CTA to PDP & cart add', async ({ page }) => {
    await openProductGrid(page);
    const firstProduct = page.getByTestId('all-products-header').first();
    await firstProduct.click();

    await expect(page.getByTestId('product-name')).toBeVisible();
    await page.getByTestId('add-to-cart-button').click();
    await page.getByTestId('header-cart-icon').click();

    await expect(page.getByTestId('cart-drawer')).toBeVisible();
    await expect(page.getByTestId('header-cart-count')).toContainText('1', { timeout: 10_000 });
  });

  test('MCP02 - login flow exposes logout control', async ({ page }) => {
    await login(page);

    await page.getByTestId('header-user-icon').click();
    const logoutButton = page.getByTestId('menu-item-label').filter({ hasText: 'Log out' });
    await expect(logoutButton).toBeVisible();
  });

  test('MCP03 - login validation messages', async ({ page }) => {
    await page.getByTestId('header-user-icon').click();
    await page.getByTestId('login-submit-button').click();

    await expect(page.getByTestId('login-email-error')).toBeVisible();
    await expect(page.getByTestId('login-password-error')).toBeVisible();
  });

  test('MCP04 - wishlist adds first grid product after visit', async ({ page }) => {
    await openProductGrid(page);
    const firstProductHeader = page.getByTestId('all-products-header').first();
    const productName = ((await firstProductHeader.textContent()) || '').trim();
    await firstProductHeader.click();
    await expect(page.getByTestId('product-name')).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/products/);

    await page.getByTestId('all-products-wishlist-button').first().click();
    await page.getByTestId('header-wishlist-button').click();

    await expect(page.getByTestId('wishlist-title')).toBeVisible();
    await expect(page.getByTestId('header-wishlist-count')).toContainText('1', { timeout: 10_000 });
    if (productName) {
      await expect(page.getByTestId('wishlist-product-name').first()).toContainText(productName, { timeout: 10_000 });
    }
  });

  test('MCP05 - product filter apply & reset', async ({ page }) => {
    await openProductGrid(page);

    await page.getByTestId('all-products-filter-icon').click();
    await page.getByTestId('all-products-category-select').selectOption('Uncategorized');
    await expect(page.getByTestId('all-products-category-select')).toHaveValue('uncategorized');

    await page.getByTestId('all-products-reset-all-filters-button').click();
    await expect(page.getByTestId('all-products-filter-icon')).toBeVisible();
  });
});



