import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { Navbar } from '../../../dashboard/components/navbar/navbar';
import { SketchService } from '../../services/sketch.service';
import { GuessService } from '../../services/guess.service';

@Component({
  selector: 'app-guess-page',
  standalone: true,
  imports: [Navbar, FormsModule, DatePipe, NgClass, RouterLink],
  templateUrl: './guess-page.html',
  styleUrl: './guess-page.scss',
})
export class GuessPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sketchService = inject(SketchService);
  private guessService = inject(GuessService);

  // Stato del gioco
  isLoading = signal<boolean>(true);
  sketch = signal<any>(null);

  // Input e Tentativi
  guessInput = signal<string>('');
  previousGuesses = signal<any[]>([]);
  attemptsLeft = signal<number>(10);

  // Esito
  gameState = signal<'playing' | 'won' | 'lost'>('playing');
  solutionText = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    // Si mete in ascolto dei cambiamenti nell'URL
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.resetGameState();

      if (idParam === 'random') {
        this.loadRandomSketch();
      } else if (idParam) {
        this.loadSketchById(Number(idParam));
      }
    });
  }

  // Resetta le variabili quando si cambia disegno
  private resetGameState() {
    this.isLoading.set(true);
    this.sketch.set(null);
    this.guessInput.set('');
    this.previousGuesses.set([]);
    this.attemptsLeft.set(10);
    this.gameState.set('playing');
    this.solutionText.set(null);
    this.errorMessage.set(null);
  }

  // Carica un disegno casuale tra quelli giocabili evitando i duplicati
  private loadRandomSketch() {
    this.sketchService.getPlayableSketches().subscribe({
      next: (res) => {
        const allSketches = res.data?.sketches || res.data || [];
        
        // Recupero ID già visti dalla sessione
        const seenIds = JSON.parse(sessionStorage.getItem('seen_sketches') || '[]');
        
        // Filtro i disegni non ancora visti
        let available = allSketches.filter((s: any) => !seenIds.includes(s.id));

        // Se finiti, resetta la memoria e riparte
        if (available.length === 0) {
          if (allSketches.length > 0) {
             sessionStorage.removeItem('seen_sketches');
             available = allSketches;
          } else {
             this.errorMessage.set('Nessun nuovo disegno disponibile al momento!');
             this.isLoading.set(false);
             return;
          }
        }

        const randomSketch = available[Math.floor(Math.random() * available.length)];
        
        // Aggiorno la memoria dei visti
        const updatedSeen = [...JSON.parse(sessionStorage.getItem('seen_sketches') || '[]'), randomSketch.id];
        sessionStorage.setItem('seen_sketches', JSON.stringify(updatedSeen));

        this.sketch.set(randomSketch);
        this.loadPreviousGuesses(randomSketch.id);
      },
      error: (err) => {
        this.errorMessage.set('Errore nel caricamento del disegno.');
        this.isLoading.set(false);
      }
    });
  }

  // Recupero disegno specifico 
  private loadSketchById(id: number) {
    this.sketchService.getSketchById(id).subscribe({
      next: (res) => {
        const sketchData = res.data?.sketch || res.data;
        this.sketch.set(sketchData);
        this.loadPreviousGuesses(sketchData.id);
      },
      error: (err) => {
        console.error('Errore nel recupero dello sketch', err);
        this.errorMessage.set('Disegno non trovato o non giocabile.');
        this.isLoading.set(false);
      }
    });
  }

  // Recuperostroico tentativi e aggiornamento stato
  private loadPreviousGuesses(sketchId: number) {
    this.guessService.getPreviousGuesses(sketchId).subscribe({
      next: (res) => {
        const guesses = res.data?.guesses || [];
        this.previousGuesses.set(guesses);

        // Calcolo quanti tentativi rimangono in base alla lunghezza dello storico
        const left = 10 - guesses.length;
        this.attemptsLeft.set(left);

        // Controllo se c'è già una vittoria nello storico
        const hasWon = guesses.some((g: any) => g.isCorrect);
        if (hasWon) {
          this.gameState.set('won');
        } else if (left <= 0) {
          this.gameState.set('lost');
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Errore nel caricamento dello storico tentativi', err);
        this.isLoading.set(false);
      } 
    });
  }

  // Gestione dell'invio di un tentativo
  submitGuess() {
    const attempt = this.guessInput().trim();
    if (!attempt || this.gameState() !== 'playing') return;

    this.errorMessage.set(null); // Pulisco gli errori

    this.guessService.makeGuess(this.sketch().id, attempt).subscribe({
      next: (res) => {
        const result = res.data;

        // Svuoto l'input
        this.guessInput.set('');

        // Aggiorno la UI in tempo reale
        this.attemptsLeft.set(result.attemptsLeft);

        // Invece di fare una nuova chiamata al DB, aggiungo il nuovo tentativo alla lista visiva!
        this.previousGuesses.update(guesses => [...guesses, result.guess]);

        if (result.isCorrect) {
          this.gameState.set('won');
          this.solutionText.set(result.solution);
        } else if (result.attemptsLeft <= 0) {
          this.gameState.set('lost');
          this.solutionText.set(result.solution);
        }
      },
      error: (err) => {
        console.error('Erore durante il tentativo', err);
        this.errorMessage.set(err.error?.message || err.error?.description || 'Parola non valida o errore.');
      }
    });
  }

  // Tasto per skippare al prossimo disegno casuale
  skipSketch() {
  // Chiamo il backend per sapere quanti sono "giocabili"
  this.sketchService.getPlayableSketches().subscribe(res => {
    const playable = res.data?.sketches || res.data || [];
    const currentId = this.sketch().id;

    // Filtro per trovare quelli diversi da quello che stiamo guardando
    const others = playable.filter((s: any) => s.id !== currentId);

    // Se ne ce n'è almeno uno, saltiamo su quello
    if (others.length > 0) {
      const nextSketch = others[Math.floor(Math.random() * others.length)];
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/guess', nextSketch.id]);
      });
    } 
    // Se non ce ne sono altri (playable.length == 1 o 0), avviso
    else {
      alert("Non ci sono altri disegni da indovinare!");
    }
  });
}

}
