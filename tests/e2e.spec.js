import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || "parth.alphabin@gmail.com";
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || "Parth@321";
const TEST_FIRST_NAME = process.env.TEST_USER_FIRST_NAME || "PARTH";
const TEST_CITY = process.env.TEST_USER_CITY || "XYZ";
const TEST_STATE = process.env.TEST_USER_STATE || "XYZ";
const TEST_STREET = process.env.TEST_USER_STREET || "XYZ";
const TEST_ZIPCODE = process.env.TEST_USER_ZIPCODE || "232322";
const TEST_COUNTRY = process.env.TEST_USER_COUNTRY || "XYZ";


test.only('should-product-successfully-purchased-e2e', async ({ page }) => {
  await page.goto('https://demo.alphabin.co/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AB | Demo Store/);

  //login

  await page.getByTestId('header-user-icon').click()

  await page.getByTestId('login-email-input').fill(TEST_EMAIL)

  await page.getByTestId('login-password-input').fill(TEST_PASSWORD)

  await page.getByTestId('login-submit-button').click()

  await expect(page.getByText('Logged in successfully')).toBeVisible({ timeout:30000 })

  //select product

  await page.getByRole('link', { name: 'Shop Now' }).click();

  await page.getByTestId('all-products-header').first().click();

  await page.getByTestId('buy-now-button').click()

  //fill payment and add details

  await page.getByTestId('checkout-first-name-input').fill(TEST_FIRST_NAME)

  await page.getByTestId('checkout-email-input').fill(TEST_EMAIL)

  await page.getByTestId('checkout-city-input').fill(TEST_CITY)

  await page.getByTestId('checkout-state-input').fill(TEST_STATE)

  await page.getByTestId('checkout-street-input').fill(TEST_STREET)

  await page.getByTestId('checkout-zip-code-input').fill(TEST_ZIPCODE)
  
  await page.getByTestId('checkout-country-input').fill(TEST_COUNTRY)
  
  await page.getByTestId('checkout-save-address-button').click()

  await page.getByTestId('checkout-cod-button').click()

  //confirm order
  
  await page.getByTestId('checkout-place-order-button').click()

  await expect(page.getByTestId('order-placed-message')).toBeVisible()

  await expect(page.getByTestId('order-confirmed-title')).toBeVisible()
  


});
