// filepath: tests/test_README.spec.js
const { test, expect } = require('@playwright/test');

test.describe('LM Studio Chat Interface Tests @fail', () => {
   test('should have the correct title', async ({ page }) => {
      await page.goto('index.html');
      await expect(page).toHaveTitle('LM Studio Chat Interface');
   });

   test('should have key UI elements', async ({ page }) => {
      await page.goto('index.html');
      await expect(page.locator('#server-address')).toBeVisible();
      await expect(page.locator('#connect-button')).toBeVisible();
      await expect(page.locator('#model-selector')).toBeVisible();
      await expect(page.locator('#message-input')).toBeVisible();
      await expect(page.locator('#send-button')).toBeVisible();
   });

   test('should connect to the server', async ({ page }) => {
      await page.goto('index.html');
      await page.fill('#server-address', 'http://localhost:1234');
      await page.click('#connect-button');
      // Add an assertion to check for successful connection, e.g., check for model options loading
      await expect(page.locator('#model-selector option').first()).toBeVisible({ timeout: 10000 });
   });

   test('should send a message and receive a response', async ({ page }) => {
      await page.goto('index.html');
      await page.fill('#server-address', 'http://localhost:1234');
      await page.click('#connect-button');
      await page.selectOption('#model-selector', { label: 'Test Model' }); // Replace 'Test Model' with an actual model name
      await page.fill('#message-input', 'Hello, LM Studio!');
      await page.click('#send-button');
      // Add an assertion to check for a response message
      await expect(page.locator('.message.assistant')).toBeVisible({ timeout: 10000 });
   });

   test('should display a timestamp for each message', async ({ page }) => {
      await page.goto('index.html');
      await page.fill('#server-address', 'http://localhost:1234');
      await page.click('#connect-button');
      await page.selectOption('#model-selector', { label: 'Test Model' }); // Replace 'Test Model' with an actual model name
      await page.fill('#message-input', 'Hello, LM Studio!');
      await page.click('#send-button');
      await expect(page.locator('.message .timestamp')).toBeVisible({ timeout: 10000 });
   });

   test('should clear the chat history when the clear button is clicked', async ({ page }) => {
      await page.goto('index.html');
      await page.fill('#server-address', 'http://localhost:1234');
      await page.click('#connect-button');
      await page.selectOption('#model-selector', { label: 'Test Model' }); // Replace 'Test Model' with an actual model name
      await page.fill('#message-input', 'Hello, LM Studio!');
      await page.click('#send-button');
      await page.click('#clear-button');
      await expect(page.locator('.message')).not.toBeVisible();
   });

   test('should save and load a conversation', async ({ page }) => {
      await page.goto('index.html');
      await page.fill('#server-address', 'http://localhost:1234');
      await page.click('#connect-button');
      await page.selectOption('#model-selector', { label: 'Test Model' }); // Replace 'Test Model' with an actual model name
      await page.fill('#message-input', 'Test message');
      await page.click('#send-button');
      await page.click('#save-button'); // Assuming you have a save button
      await page.fill('#conversation-title', 'Test Conversation'); // Assuming you have a title input
      await page.click('#confirm-save'); // Assuming you have a confirmation button
      await page.click('#new-chat-button');
      await page.click('#load-conversation'); // Assuming you have a load button
      await page.click('text=Test Conversation'); // Assuming the saved conversation is displayed as text
      await expect(page.locator('.message-content')).toContainText('Test message');
   });
});