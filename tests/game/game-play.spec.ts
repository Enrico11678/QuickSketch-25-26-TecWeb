import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

// Crea un file di sessione unico per ogni browser in parallelo
const workerId = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.TEST_WORKER_INDEX || '0';
const sessionFile = `storage/game-session-${workerId}.json`;

test.describe('Flusso di gioco', () => {

    // Test di setup che salva lo stato nel file temporaneo game-session.json
    test('0. Setup Autenticazione', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        const email = `test_${uniqueId}@email.com`;
        const username = `Giocatore_${uniqueId}`;
        
        // Registrazione 
        await page.goto('/register');
        await page.getByPlaceholder('Nome Utente').fill(username);
        await page.getByPlaceholder('Email').fill(email);
        await page.getByPlaceholder('Password').fill('Password123!@#');
        const registerBtn = page.getByRole('button', { name: /registrati/i });
        await registerBtn.scrollIntoViewIfNeeded();

        await Promise.all([
            page.waitForResponse(res => res.url().includes('/api/') && res.status() === 201),
            registerBtn.click()
        ]);

        // Login
        await expect(page).toHaveURL(/.*login/);
        await page.getByPlaceholder('Email').fill(email);
        await page.getByPlaceholder('Password').fill('Password123!@#');
        const loginBtn = page.getByRole('button', { name: /accedi/i });
        
        // Verifica che il login sia andato a buon fine e che il frontend abbia effettivamente scritto il token
        await Promise.all([
            page.waitForResponse(res => res.url().includes('/api/auth/login') && res.status() === 200),
            loginBtn.click()
        ]);

        await page.waitForFunction(() => localStorage.getItem('auth_token') !== null);

        await expect(page).toHaveURL(/.*dashboard/);

        // Salva lo stato autenticato
        await context.storageState({ path: sessionFile });
        await context.close();
    });

    test.describe('Test autenticati', () => {
        test.use({ storageState: sessionFile });

        async function getAuthToken(page: any) {
            return await page.evaluate(() => localStorage.getItem('token'));
        }

        test('6. Creazione Sketch', async ({ page }) => {
            // Arrange
            await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
            await page.getByRole('button', { name: /inizia a disegnare!/i }).click();
            await expect(page).toHaveURL(/.*draw/);

            // Seleziona la prima parola disponibile
            const firstWordBtn = page.locator('.word-card-btn').first();
            await expect(firstWordBtn).toBeVisible({ timeout: 10000 });
            await firstWordBtn.click();

            const canvas = page.locator('canvas.sketch-canvas');
            const saveBtn = page.locator('.save-btn');

            // Verifica lo stato iniziale: canvas visibile e button salva bloccato
            await expect(canvas).toBeVisible();
            await expect(saveBtn).toBeDisabled();

            // Calcola le coordinate della canvas per cliccare nei bordi
            const canvasBox = await canvas.boundingBox();
            if (!canvasBox) throw new Error('Canvas non trovato nella pagina!');
            const startX = canvasBox.x + 100;
            const startY = canvasBox.y + 100;

            // Act
            await page.mouse.move(startX, startY);
            await page.mouse.down();
            await page.waitForTimeout(100);
            await page.mouse.move(startX + 150, startY + 50, { steps: 5 }); 
            await page.mouse.move(startX + 100, startY + 150, { steps: 5 });
            await page.mouse.up();

            const [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/api/') && res.request().method() === 'POST'),
                saveBtn.click()
            ]);

            expect(response.status()).toBe(201);

            // Assert
            await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

            // Verifica la comparsa della notifica di successo
            const successToast = page.locator('.toast.success');
            await expect(successToast).toBeVisible();
            await expect(successToast).toContainText(/pubblicato con successo/i);
        });

        test('7. Tempo Limite', async ({ page }) => {
            // Aumento il timeout per questo test a 90 secondi così Playwright non lo ucciderà mentre aspetta
            test.setTimeout(90000);
            
            // Arrange
            await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
            await page.getByRole('button', { name: /inizia a disegnare!/i }).click();

            const firstWordBtn = page.locator('.word-card-btn').first();
            await expect(firstWordBtn).toBeVisible({ timeout: 10000 });
            await firstWordBtn.click();

            // Verifica che il timer inizi a 01:00
            const timerDisplay = page.locator('.time-left');
            await expect(timerDisplay).toHaveText('01:00');            

            // Act & Assert 

            // Gli do 65 secondi per compensare micro-lag del browser 
            await expect(timerDisplay).toHaveText('00:00', { timeout: 65000 });

            const overlay = page.locator('.canvas-overlay');
            await expect(overlay).toBeVisible();
            await expect(overlay).toContainText(/Tempo Scaduto/i);

            const blackColorBtn = page.locator('.color-btn.black');
            await expect(blackColorBtn).toBeDisabled();
        });

        test('8. Indovinare lo Sketch (Flusso Tentativo Errato)', async ({ page }) => {
            // Arrange 
            await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
            await page.getByRole('button', { name: /prova a indovinare!/i }).click();

            // Per evitare Flakiness aspetto che il disegno sia visibile
            const sketchImage = page.locator('.sketch-image');
            await expect(sketchImage).toBeVisible({ timeout: 15000 });

            // Verifica lo stato iniziale del counter
            const attemptsLeft = page.locator('.attempts-counter strong');
            await expect(attemptsLeft).toHaveText('10');

            const noGuessesMsg = page.locator('.no-guesses');
            await expect(noGuessesMsg).toBeVisible();

            // Act
            const guessInput = page.getByPlaceholder('Scrivi qui la tua risposta...');
            const submitBtn = page.getByRole('button', { name: 'Invia' });
            
            await guessInput.fill('TestParolaSbagliata');

            const [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/api/') && res.request().method() === 'POST'),
                submitBtn.click()
            ]);

            expect(response.status()).toBe(201);

            // Assert
            await expect(attemptsLeft).toHaveText('9');
            await expect(guessInput).toBeEmpty();
            // Il messaggio "Ancora nessun tentativo" deve essere sparito
            await expect(noGuessesMsg).toBeHidden();
            // La cronologia deve contenere il tentativo con l'icona di errore
            const historyList = page.locator('.guesses-list');
            await expect(historyList).toBeVisible();
            await expect(historyList).toContainText('TestParolaSbagliata');
            await expect(historyList).toContainText('❌');
        });

        test('9. Indovinare lo Sketch (Flusso Successo)', async ({ page }) => {
            // Arrange
            await page.goto('/dashboard', { waitUntil: 'networkidle' });

            const token = await page.evaluate(() => localStorage.getItem('auth_token'));
            if (!token) throw new Error('Token non trovato (chiave auth_token)');

            // Recupera dati usando il token passato come argomento
            const { parolaCorretta, sketchId } = await page.evaluate(async (token) => {
               
                const resMe = await fetch('http://localhost:3000/api/sketches/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataMe = await resMe.json();
                
                if (!dataMe.data?.sketches?.[0]) throw new Error('Nessuno sketch trovato.');
                const parola = dataMe.data.sketches[0].word.text;

                const resPlayable = await fetch('http://localhost:3000/api/sketches/playable', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataPlayable = await resPlayable.json();
                
                if (!dataPlayable.data?.sketches?.[0]) throw new Error('NO_PLAYABLE');
                
                return { parolaCorretta: parola, sketchId: dataPlayable.data.sketches[0].id };
            }, token); 

            // Act
            await page.goto(`/guess/${sketchId}`); 
            await expect(page.locator('.sketch-image')).toBeVisible({ timeout: 15000 });
            
            await page.getByPlaceholder('Scrivi qui la tua risposta...').fill(parolaCorretta);
            await page.getByRole('button', { name: 'Invia' }).click();

            // Assert
            await expect(page.locator('.result-area.success')).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.result-area.success')).toContainText(parolaCorretta);
        });
    });
});