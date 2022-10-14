import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Check Page', () => {
  test('Page Title', async ({ page }) => {
    //   Expect a title to contain the text Drivvn
    await expect(page).toHaveTitle(/Drivvn/);
  });

  test('CheckId', async ({ page }) => {
    // Expect that the page url has a deckId
    await expect(page).toHaveURL(/.*deckId/);
  });

  test('Check Snapshot', async ({ page }) => {
    //   Expect to have an h1 with the text SNAP!
    const snapText = page.getByText('SNAP!');
    await expect(snapText).toHaveText('SNAP!');
  });

  test('Get a new deck', async ({ page }) => {
    //   Create a locator for the Get a new deck button
    const getNewDeck = page.getByText('Get a new deck');
    //   Expect the button to have an attribute of href with the value of /
    await expect(getNewDeck).toHaveAttribute('href', '/');
    //   Click the Get a new deck button
    await getNewDeck.click();
    // Expect that the page url has a deckId
    await expect(page).toHaveURL(/.*deckId/);
  });

  test('Remaining Cards', async ({ page }) => {
    let remainingCards = 52;
    // Create a locator for the remaining cards
    const remainingCardsLocator = page.getByText(
      `Remaining cards: ${remainingCards}`
    );
    // Expect the remaining cards to have the text Remaining cards: 52
    await expect(remainingCardsLocator).toHaveText(
      `Remaining cards: ${remainingCards}`
    );
  });

  test('Draw a card', async ({ page }) => {
    //   Create a locator for the Draw a card button
    const drawACard = page.getByText('Draw a card');
    //   Expect the button to have an attribute type submit
    await expect(drawACard).toHaveAttribute('type', 'submit');
  });

  test('Card containers', async ({ page }) => {
    //   Create a locator for the old card container
    const oldCardContainer = page.locator('#old-card-container');
    // Expect the old card container to be empty
    await expect(oldCardContainer).toBeEmpty();
    //   Create a locator for the new card container
    const newCardContainer = page.locator('#new-card-container');
    // Expect the new card container to be empty
    await expect(newCardContainer).toBeEmpty();
  });
});

test.describe('Play the game', () => {
  test('Play the game until 0 cards remain', async ({ page }) => {
    test.setTimeout(120000);
    let remainingCards = 52;
    //   Create a locator for the Draw a card button
    const drawACard = page.getByText('Draw a card');
    //   Click the Draw a card button 52 times to draw all the cards
    for (let i = 0; i < 52; i++) {
      remainingCards--;
      await drawACard.click();
      await page.waitForTimeout(500);
      // Create a locator for the remaining cards
      const remainingCardsLocator = page.locator('id=remaining-cards');
      // Expect the remaining cards to have the text Remaining cards
      await expect(remainingCardsLocator).toHaveText(
        `Remaining cards: ${remainingCards}`
      );
    }
    const remainingCardsLocator2 = page.locator('id=remaining-cards');
    //   Expect the remaining cards to have the text Remaining cards: 0
    await expect(remainingCardsLocator2).toHaveText(`Remaining cards: 0`);
    // Expect to have a span with the id of value-matches
    const valueMatches = page.locator('id=value-matches');
    expect(valueMatches).toBeTruthy();
    // Expect to have a span tag with the id of suit-matches
    const suitMatches = page.locator('id=suit-matches');
    expect(suitMatches).toBeTruthy();
  });
});
