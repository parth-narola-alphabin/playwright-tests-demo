import { test, expect } from '@playwright/test';

test('second product quantity adjusts and persists in cart', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Shop Now' }).click();
  await expect(page).toHaveURL(/\/products/);

  const secondProduct = page.getByTestId('all-products-header').nth(1);
  await expect(secondProduct).toBeVisible();
  const productName = ((await secondProduct.textContent()) || '').trim();
  await secondProduct.click();

  const quantityValue = page.getByTestId('quantity-value');
  const quantityControls = quantityValue.locator('..');
  await expect(quantityValue).toHaveText('1');

  const increment = quantityControls.getByRole('img', { name: 'plus' });
  const decrement = quantityControls.getByRole('img', { name: 'minus' });

  await increment.click();
  await increment.click();
  await decrement.click();

  await expect(quantityValue).toHaveText('2');

  await page.getByTestId('add-to-cart-button').click();
  await page.getByTestId('header-cart-icon').click();

  const cartDrawer = page.getByTestId('cart-drawer');
  await expect(cartDrawer).toBeVisible({ timeout: 10_000 });
  const cartItemQuantity = cartDrawer.getByTestId('item-quantity').first();

  await expect(cartItemQuantity).toHaveText('2', { timeout: 10_000 });
  if (productName) {
    await expect(cartDrawer.getByTestId('cart-item-header').first()).toContainText(productName);
  }
});


