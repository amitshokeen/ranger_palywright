import { Page, expect } from '@playwright/test';
	/**
	 * This test was generated using Ranger's test recording tool. The test is supposed to:
	 * 1. Navigate to Wikipedia's homepage
	 * 2. Assert there are less than 7,000,000 articles in English
	 * 3. Assert the page's text gets smaller when the 'Small' text size option is selected
	 * 4. Assert the page's text gets larger when the 'Large' text size option is selected
	 * 5. Assert the page's text goes back to the default size when the 'Standard' text size option is selected
	 *
	 * Instructions: Run the test and ensure it performs all steps described above
	 *
	 * Good luck!
	 */

export async function run(page: Page, params: {}) {
    /** STEP: Navigate to URL */
    await page.goto('https://en.wikipedia.org/wiki/Main_Page');

    /** STEP: Click the link to view the total number of articles in English */
    const totalArticlesLink = page
        .locator('li', { hasText: 'articles in English' })
        .locator('a')
        .first();

    const articleCountText = await totalArticlesLink.innerText();
    const count = parseInt(articleCountText.replace(/,/g, ''));
    expect(count).toBeLessThan(7000000);

    // Ensure the text is standard in the beginning
    await page.getByLabel('Standard').first().click();

    const textElement = page.locator('#mp-tfa p').first();
    const getFontSize = async () =>
        parseFloat(await textElement.evaluate(el => getComputedStyle(el).fontSize));

    const retryFontSizeChange = async (
        action: () => Promise<void>,
        comparison: (newSize: number, baseline: number) => boolean,
        baseline: number,
        label: string
    ): Promise<number> => {
        await action();
        await page.waitForTimeout(200);
        let newSize = await getFontSize();

        if (!comparison(newSize, baseline)) {
            // Retry once more
            await page.waitForTimeout(200);
            newSize = await getFontSize();

            if (!comparison(newSize, baseline)) {
                throw new Error(
                    `Font size after selecting '${label}' was ${newSize}px, expected a ${
                        label === 'Small' ? 'decrease' : label === 'Large' ? 'increase' : 'reset'
                    } from baseline ${baseline}px`
                );
            }
        }

        return newSize;
    };

    const originalFontSize = await getFontSize();

    /** STEP: Select the 'Small' text size option in the appearance settings */
    const smallFontSize = await retryFontSizeChange(
        () => page.getByLabel('Small').click(),
        (newSize, baseline) => newSize < baseline,
        originalFontSize,
        'Small'
    );
    expect(smallFontSize).toBeLessThan(originalFontSize);

    /** STEP: Click the 'Large' text size option to change the display size */
    const largeFontSize = await retryFontSizeChange(
        () => page.getByLabel('Large').click(),
        (newSize, baseline) => newSize > baseline,
        smallFontSize,
        'Large'
    );
    expect(largeFontSize).toBeGreaterThan(smallFontSize);

    /** STEP: Click the 'Standard' text size option in the appearance settings */
    const standardFontSize = await retryFontSizeChange(
        () => page.getByLabel('Standard').first().click(),
        (newSize, baseline) => newSize === baseline,
        originalFontSize,
        'Standard'
    );
    expect(standardFontSize).toEqual(originalFontSize);
}
