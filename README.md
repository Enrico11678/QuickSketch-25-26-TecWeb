# QuickSketch - Progetto Tecnologie Web 2025/2026

## 1. Descrizione del Progetto
**QuickSketch** è un'applicazione web full-stack ispirata al gioco *Pictionary*. La piattaforma permette agli utenti registrati di creare sketch basati su parole predefinite, pubblicarli e sfidare altri utenti a indovinare la parola associata, offrendo un'esperienza di gioco dinamica e competitiva.

## 2. Architettura
Il progetto è organizzato in due moduli principali:
* **/backend**: API RESTful sviluppata in **Node.js/TypeScript** con Express.
* **/frontend**: Single Page Application (SPA) sviluppata in **Angular**.

## 3. Requisiti di Sistema
Per eseguire l'applicazione è necessario avere installato:
* [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
* [Node.js](https://nodejs.org/) (versione consigliata 20+)

## 4. Istruzioni per l'Esecuzione

### Installazione Dipendenze (Locale)
Prima di avviare il sistema, è necessario installare le dipendenze in entrambe le cartelle (`backend` e `frontend`):

  ```bash
  # Installa dipendenze backend
  cd backend
  npm install
  cd ..

  # Installa dipendenze frontend
  cd frontend
  npm install
  cd ..
```
Il sistema è interamente containerizzato per garantire la massima portabilità.

1. Assicurarsi di essere nella cartella root del progetto.
2. Avviare l'intera infrastruttura (Database, Backend, Frontend):
   ```bash
   docker compose up -d
   ```
3. L'applicazione sarà disponibile sul browser all'indirizzo: http://localhost

## 5. Test End-to-End (Playwright)
Il progetto include una suite di test automatizzati realizzata con Playwright. La suite comprende 10 funzionalità core testate su 3 diversi browser, per un totale di 33 esecuzioni di test (inclusi i test di setup). Per eseguirli:

1. Aprire il terminale nella root del progetto.

2. Lanciare i test:
   ```bash
   npx playwright test
   ```
3. Per visualizzare il report dettagliato dell'esecuzione:
   ```bash
   npx playwright show-report
   ```


