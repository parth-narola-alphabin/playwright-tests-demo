import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'parth.alphabin@gmail.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'Parth@321';
const TEST_FIRST_NAME = process.env.TEST_USER_FIRST_NAME || 'PARTH';
const TEST_CITY = process.env.TEST_USER_CITY || 'XYZ';
const TEST_STATE = process.env.TEST_USER_STATE || 'XYZ';
const TEST_STREET = process.env.TEST_USER_STREET || 'XYZ';
const TEST_ZIPCODE = process.env.TEST_USER_ZIPCODE || '232322';
const TEST_COUNTRY = process.env.TEST_USER_COUNTRY || 'XYZ';

async function login(page) {
  await page.getByTestId('header-user-icon').click();
  await page.getByTestId('login-email-input').fill(TEST_EMAIL);
  await page.getByTestId('login-password-input').fill(TEST_PASSWORD);
  await page.getByTestId('login-submit-button').click();
  await expect(page.getByText('Logged in successfully')).toBeVisible({ timeout: 30_000 });
}

async function ensureShippingAddress(page) {
  const addButton = page.getByTestId('add-new-address-button');
  const changeButton = page.getByTestId('checkout-change-address-button');
  const canAddNew = await addButton.isVisible().catch(() => false);

  if (!canAddNew) {
    return;
  }

  if (await changeButton.isVisible().catch(() => false)) {
    await changeButton.click();
  }

  await addButton.click();
  const firstNameInput = page.getByTestId('checkout-first-name-input');
  await expect(firstNameInput).toBeVisible({ timeout: 30_000 });
  await firstNameInput.fill(TEST_FIRST_NAME);
  await page.getByTestId('checkout-email-input').fill(TEST_EMAIL);
  await page.getByTestId('checkout-city-input').fill(TEST_CITY);
  await page.getByTestId('checkout-state-input').fill(TEST_STATE);
  await page.getByTestId('checkout-street-input').fill(TEST_STREET);
  await page.getByTestId('checkout-zip-code-input').fill(TEST_ZIPCODE);
  await page.getByTestId('checkout-country-input').fill(TEST_COUNTRY);
  await page.getByTestId('checkout-save-address-button').click();
}

test('should add every catalog product to cart and purchase in one order', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/AB | Demo Store/);

  await login(page);

  await page.getByRole('link', { name: 'Shop Now' }).click();
  await expect(page).toHaveURL(/\/products/);

  const addButtons = page.getByTestId('all-products-cart-button');
  const productHeaders = page.getByTestId('all-products-header');
  const catalogCount = await addButtons.count();
  expect(catalogCount).toBeGreaterThan(0);

  const addedProducts = [];
  for (let i = 0; i < catalogCount; i += 1) {
    const button = addButtons.nth(i);
    const header = productHeaders.nth(i);
    await header.scrollIntoViewIfNeeded();
    const name = ((await header.textContent()) || '').trim();
    if (name) {
      addedProducts.push(name);
    }
    await button.click();
    await expect(page.getByTestId('header-cart-count')).toContainText(String(i + 1), { timeout: 10_000 });
  }

  await page.getByTestId('header-cart-icon').click();
  const cartDrawer = page.getByTestId('cart-drawer');
  await expect(cartDrawer).toBeVisible({ timeout: 10_000 });

  await expect(cartDrawer.getByTestId('cart-item')).toHaveCount(addedProducts.length);
  await cartDrawer.getByTestId('checkout-button').click();

  await ensureShippingAddress(page);
  await page.getByTestId('checkout-cod-button').click();
  await page.getByTestId('checkout-place-order-button').click();

  await expect(page.getByTestId('order-placed-message')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('order-confirmed-title')).toBeVisible({ timeout: 30_000 });

  if (addedProducts.length) {
    await expect(page.getByTestId('order-id')).not.toHaveText('');
    await expect(page.getByTestId('order-details-title')).toBeVisible();
  }
});


