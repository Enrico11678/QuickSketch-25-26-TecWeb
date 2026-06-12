import { test, expect } from '@playwright/test';

// Forza l'esecuzione in ordine
test.describe.configure({ mode: 'serial' });

test.describe('Flusso di autenticazione completo', () => {

    let testEmail: string;
    let testUser: string;

    test.beforeAll(async () => {
        const uniqueId = Date.now().toString() + Math.random().toString(36).substring(7);
        testEmail = `test_${uniqueId}@email.com`;
        testUser = `user_${uniqueId}`;
    });

    test('1. Registrazione utente con successo', async ({ page }) => {
        // Arrange
        await page.goto('/register');

        // Act        
        await page.getByPlaceholder('Nome Utente').fill(testUser);
        await page.getByPlaceholder('Email').fill(testEmail);
        await page.getByPlaceholder('Password').fill('Password123!@#');
        
        const submitBtn = page.getByRole('button', { name: /registrati/i });
        await expect(submitBtn).toBeEnabled();
        await submitBtn.scrollIntoViewIfNeeded();
        
        // Aspettiamo che l'API risponda 201 (Created)
        await Promise.all([
            page.waitForResponse(res => res.url().includes('/api/auth/register') && res.status() === 201),
            submitBtn.click()
        ]);

        // Assert
        await expect(page).toHaveURL(/.*login/);
    });

    test('2. Login con credenziali valide reindirizza alla dashboard', async ({ page }) => {
        // Arrange
        await page.goto('/login');

        // Act
        await page.getByPlaceholder('Email').fill(testEmail);
        await page.getByPlaceholder('Password').fill('Password123!@#');
        
        // Aspettiamo la risposta 200 dell'API di login
        await Promise.all([
            page.waitForResponse(res => res.url().includes('/api/auth/login') && res.status() === 200),
            page.getByRole('button', { name: /accedi/i }).click()
        ]);

        // Assert
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
        
        const token = await page.evaluate(() => localStorage.getItem('auth_token'));
        expect(token).not.toBeNull();
        expect(token?.length).toBeGreaterThan(10);
    });

    test('3. Login fallito con credenziali errate mostra messaggio di errore', async ({ page }) => {
        // Arrange
        await page.goto('/login');

        // Act
        await page.getByPlaceholder('Email').fill('errato@email.com');
        await page.getByPlaceholder('Password').fill('passwordSbagliata1!@#');
        await page.getByRole('button', { name: /accedi/i }).click();

        // Assert
        const token = await page.evaluate(() => localStorage.getItem('auth_token'));
        expect(token).toBeNull();

        await expect(page).toHaveURL(/.*login/);
        await expect(page.locator('.toast.error')).toBeVisible();
        await expect(page.locator('.toast.error')).toContainText(/email o password errati/i);
    });

    test('4. Logout utente', async ({ page }) => {
        // Arrange
        await page.goto('/login');
        await page.getByPlaceholder('Email').fill(testEmail);
        await page.getByPlaceholder('Password').fill('Password123!@#');
        await page.getByRole('button', { name: /accedi/i }).click();
        
        await expect(page.locator('.btn-logout')).toBeVisible({ timeout: 15000 });

        // Act
        await page.locator('.btn-logout').click({ force: true });

        // Assert
        await expect(page).toHaveURL(/.*login/);
        
        const token = await page.evaluate(() => localStorage.getItem('auth_token'));
        expect(token).toBeNull();
    });

    test('5. Eliminazione account utente', async ({ page }) => {
        // Arrange
        await page.goto('/login');
        await page.getByPlaceholder('Email').fill(testEmail);
        await page.getByPlaceholder('Password').fill('Password123!@#');
        await page.getByRole('button', { name: /accedi/i }).click();
        
        await expect(page).toHaveURL(/.*dashboard/);
        
        await page.locator('a[routerlink="/profile"]').click();
        
        await expect(page).toHaveURL(/.*profile/); 
        
        // Act
        page.on('dialog', dialog => dialog.accept());

        const deleteBtn = page.locator('.danger-zone button.btn-delete');
        
        await expect(deleteBtn).toBeVisible({ timeout: 15000 });
        await deleteBtn.scrollIntoViewIfNeeded();

        await Promise.all([
            page.waitForResponse(res => res.url().includes('/api/users/me') && (res.status() === 200 || res.status() === 204)),
            deleteBtn.click()
        ]);

        // Assert
        await expect(page).toHaveURL(/.*login/);
        const token = await page.evaluate(() => localStorage.getItem('auth_token'));
        expect(token).toBeNull();
    });
});