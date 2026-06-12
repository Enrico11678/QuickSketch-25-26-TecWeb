import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

const sessionFile = 'storage/auth-session.json';

test.describe('Leaderboard Page', () => {

    // Rende il test autenticato
    test.use({ storageState: sessionFile });

    test('10. Verifica caricamento e rendering classifica', async ({ page }) => {
        // Arrange
        // Naviga alla pagina e vede che il layout sia pronto
        await page.goto('/leaderboard');
        const designersTabBtn = page.getByRole('button', { name: /top disegnatori/i });
        const playersTabBtn = page.getByRole('button', { name: /top indovini/i });
        const table = page.locator('.leaderboard-table');

        // Act
        // Verifica che di default sia attiva la classifica dei Disegnatori
        await expect(designersTabBtn).toBeVisible();
        await expect(designersTabBtn).toHaveClass(/active/);

        // Clicca sul tab dei giocatori per cambiare vista
        await playersTabBtn.click();

        // Assert
        await expect(playersTabBtn).toHaveClass(/active/);
        await expect(table).toBeVisible();

        // Verifica che la tabella contenga le colonne corrette per i giocatori
        const header = table.locator('thead');
        await expect(header).toContainText(/Pos./i);
        await expect(header).toContainText(/Utente/i);
        await expect(header).toContainText(/Parole Indovinate/i);

        // Verifica che i dati siano stati caricati
        const firstRow = table.locator('tbody tr').first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });
    });
});