import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatsService } from '../../../stats/services/stats.service';

@Component({
  selector: 'app-mini-leaderboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mini-leaderboard.html',
  styleUrl: './mini-leaderboard.scss',
})
export class MiniLeaderboard implements OnInit {
  private statsService = inject(StatsService);

  // Contenitori per i dati
  topPlayers = signal<any[]>([]);
  topDesigners = signal<any[]>([]);

  ngOnInit() {
    this.statsService.getTopPlayers(3).subscribe({
      next: (res) => this.topPlayers.set(res.data.leaderboard),
      error: (err) => console.error('Errore nel recupero top players', err)
    });

    this.statsService.getTopDesigners(3).subscribe({
      next: (res) => this.topDesigners.set(res.data.leaderboard),
      error: (err) => console.error('Errore nel recupero top designers', err)
    });
  }
}
