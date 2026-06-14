import { Component, ElementRef, ViewChild, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SketchService } from '../../services/sketch.service'; 
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-draw-page',
  imports: [RouterLink],
  templateUrl: './draw-page.html',
  styleUrl: './draw-page.scss',
})
export class DrawPage implements OnInit, OnDestroy {
  // Cattura la Canvas dall'HTML (scatta quando l'utente seleziona la parola e la canvas appare)
  @ViewChild('drawingCanvas') set canvasRef(content: ElementRef<HTMLCanvasElement>) {
    if (content) {
      this._canvasRef = content;
      this.initCanvasDrawingLogic();
    }
  }
  
  private _canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private sketchService = inject(SketchService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  wordsList = signal<{ id: number; text: string }[]>([]); 
  selectedWord = signal<{ id: number; text: string } | null>(null); 
  isGameStarted = signal<boolean>(false); 
  timeLeft = signal<number>(60); 
  formattedTime = signal<string>('01:00');
  selectedColor = signal<string>('#1e293b'); 
  timerExpired = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  // Variabili interne
  private isDrawing = false;
  private timerInterval: any;
  isCanvasDirty = false; 

  ngOnInit() {
    this.loadAvailableWords();
  }

  ngOnDestroy() {
    this.clearTimer(); 
  }

  // Recupera le parole
  loadAvailableWords() {
    this.isLoading.set(true);
    this.sketchService.getAvailableWords().subscribe({
      next: (response: any) => {
        this.wordsList.set(response.data.words);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Errore nel caricamento delle parole:', err);
        this.isLoading.set(false);
      }
    });
  }

  // Avvia la partita
  selectWordAndStart(word: { id: number; text: string }) {
    this.selectedWord.set(word);
    this.isGameStarted.set(true);
    this.startCountdown();
  }

  // Gestione del timer
  private startCountdown() {
    this.clearTimer();
    this.timerInterval = setInterval(() => {
      this.timeLeft.update((time) => {
        if (time <= 1) {
          this.clearTimer();
          this.timerExpired.set(true);
          this.isDrawing = false; 
          return 0;
        }
        return time - 1;
      });
      this.updateFormattedTime();
    }, 1000);
  }

  private updateFormattedTime() {
    const minutes = Math.floor(this.timeLeft() / 60);
    const seconds = this.timeLeft() % 60;
    const mStr = minutes < 10 ? '0' + minutes : minutes;
    const sStr = seconds < 10 ? '0' + seconds : seconds;
    this.formattedTime.set(`${mStr}:${sStr}`);
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // Logica della Canvas
  private initCanvasDrawingLogic() {
  if (!this._canvasRef) return;
  const canvas = this._canvasRef.nativeElement;
  this.ctx = canvas.getContext('2d')!;

  this.ctx.lineWidth = 4;
  this.ctx.lineCap = 'round';
  this.ctx.lineJoin = 'round';
  this.ctx.strokeStyle = this.selectedColor();

  // Eventi Mouse
  canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
  canvas.addEventListener('mousemove', (e) => this.draw(e));
  canvas.addEventListener('mouseup', () => this.stopDrawing());
  canvas.addEventListener('mouseleave', () => this.stopDrawing());

  // Eventi touch
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Blocca lo scroll della pagina
    this.startDrawing(e.touches[0]);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    this.draw(e.touches[0]);
  }, { passive: false });

  canvas.addEventListener('touchend', () => this.stopDrawing());
}

private startDrawing(e: MouseEvent | Touch) {
  if (this.timerExpired() || this.isSaving() || !this.isGameStarted()) return;
  this.isDrawing = true;
  this.isCanvasDirty = true;

  const coords = this.getCanvasCoordinates(e);
  this.ctx.beginPath();
  this.ctx.moveTo(coords.x, coords.y);
}

private draw(e: MouseEvent | Touch) {
  if (!this.isDrawing || this.timerExpired() || this.isSaving()) return;

  const coords = this.getCanvasCoordinates(e);
  this.ctx.lineTo(coords.x, coords.y);
  this.ctx.stroke();
}

  private stopDrawing() {
    this.isDrawing = false;
  }

private getCanvasCoordinates(e: any) {
  const canvas = this._canvasRef.nativeElement;
  const rect = canvas.getBoundingClientRect();
  
  const clientX = e.clientX;
  const clientY = e.clientY;

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

  // Strumenti della tavolozza
  changeColor(colorCode: string) {
    if (this.timerExpired()) return;
    this.selectedColor.set(colorCode);
    if (this.ctx) {
      this.ctx.strokeStyle = colorCode;
    }
  }

  clearCanvas() {
    if (this.timerExpired() || !this._canvasRef) return;
    const canvas = this._canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.isCanvasDirty = false;
  }

  saveSketch() {
    const word = this.selectedWord();
    if (!word || !this.isCanvasDirty || !this._canvasRef) return;

    this.isSaving.set(true);
    
    // Converte la canvas in un'immagine codificata in Base64
    const base64Image = this._canvasRef.nativeElement.toDataURL('image/png');

    this.sketchService.createSketch(word.id, base64Image).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.notificationService.show('Disegno pubblicato con successo!', 'success');
        this.router.navigate(['/profile']); 
      },
      error: (err) => {
        this.isSaving.set(false);
        this.notificationService.show(err.error?.message || 'Errore durante il salvataggio.', 'error');
      }
    });
  }
}