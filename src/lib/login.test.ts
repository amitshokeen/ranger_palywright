import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const wikipediaUsername = process.env.WIKIPEDIA_USERNAME;
const wikipediaPassword = process.env.WIKIPEDIA_PASSWORD;

const authFile = 'src/auth/login.json';

/**
 * Manually create a Wikipedia account and then finish this test
 * so that it signs into Wikipedia and captures the logged-in
 * session to src/auth/login.json, so that the tests in all.test.ts
 * run as a signed in user.
 */
test('Sign in to Wikipedia and save login session', async ({ page }) => {
    if (!wikipediaUsername || !wikipediaPassword) {
        throw new Error(`Need a username and password to sign in!`);
    }

    // Navigate to the Wikipedia login page
    await page.goto('https://en.wikipedia.org/w/index.php?title=Special:UserLogin');

    // Fill up the login form
    await page.getByPlaceholder('Enter your username').fill(wikipediaUsername);
    await page.getByPlaceholder('Enter your password').fill(wikipediaPassword);

    // Submit the form
    //await page.click('#wpLoginAttempt');
    await Promise.all([
        page.waitForLoadState('domcontentloaded'),
        page.getByRole('button', { name: 'Log in' }).click(),
    ]);

    await page.screenshot({ path: 'after-login.png', fullPage: true });

    // Wait for the user to be logged in
    await page.getByRole('button', { name: 'Personal tools' }).nth(0).click();
    await expect(page.locator('#pt-logout')).toBeVisible();

    // Save the storage state
    await page.context().storageState({ path: authFile });
});
