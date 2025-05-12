import { Page, expect } from '@playwright/test';

/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia
 * 2. Go to the "Artificial intelligence" page
 * 3. Click "View history"
 * 4. Assert that the latest edit was made by the user "Worstbull"
 *
 * Instructions:
 * - Run the test and ensure it performs all steps described above
 * - Add assertions to the test to ensure it validates the expected
 *   behavior:
 *   - If the latest edit was not made by "Worstbull" update the steps above accordingly
 *   - Write your assertion to provide clear diagnostic feedback if it fails
 *
 * Good luck!
 */
export async function run(page: Page, params: {}) {
    /** STEP: Navigate to URL */
    await page.goto('https://www.wikipedia.org/');

    /** STEP: Enter text 'art' into the search input field */
    const searchInputField = page.getByRole('searchbox', {
        name: 'Search Wikipedia',
    });
    await searchInputField.fill('artificial');

    /** STEP: Click the 'Artificial Intelligence' link in the search suggestions */
    const artificialIntelligenceLink = page.getByRole('link', {
        name: 'Artificial intelligence',
    }).first();
    await artificialIntelligenceLink.click();

    // Click "View history"
    await page.getByRole('link', { name: 'View history' }).first().click();

    // Wait for the latest edit entry to load
    const latestEditRow = page.locator('.mw-changeslist-date').first();
    await latestEditRow.scrollIntoViewIfNeeded();

    // Get the username in the same row
    const userLocator = page.locator('(//span[@class="history-user"]/a)[1]');
    const username = await userLocator.textContent();

    // Assert the username
    //const expectedUser = 'Worstbull';
    const expectedUser = 'Maxeto0910'; // this is the user at the top on May 12, 2025
    const actualUser = username?.trim();
    expect(actualUser).not.toBeNull();
    expect(actualUser === expectedUser, `Expected latest edit to be "${expectedUser}", but got "${actualUser}"`).toBe(true);
}
