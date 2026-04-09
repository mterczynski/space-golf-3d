import { test, expect, type Page } from '@playwright/test';

/**
 * Skipped because deterministic flight behavior is not fully implemented yet.
 */
test.describe.skip('test22', () => {
	test('first hit - 10 times', async ({ browser }: any) => {
		await Promise.all(new Array(10).fill(1).map(async () => {
			// Create a new incognito browser context
			const context = await browser.newContext();
			// Create a new page inside context.
			const page = await context.newPage();
			await page.goto('http://localhost:5173');

			const consoleMessages: string[] = []
			await new Promise(resolve => {
				page.on('console', (msg: any) => consoleMessages.push(msg.text()));
				setTimeout(() => { resolve(null) }, 20_000)
			})

			console.log('consoleMessages', consoleMessages)
			// console.log('filtered consoleMessages', consoleMessages.filter(msg => msg.startsWith('## simulation')))

			expect(consoleMessages.filter(msg => msg.startsWith('## simulation'))[0]).toEqual('## simulation hit 393,-478,274')
			expect(consoleMessages.filter(msg => msg.startsWith('## simulation'))[1]).toEqual('## simulation hit -207,-219,-339')
		}))
	});
});
