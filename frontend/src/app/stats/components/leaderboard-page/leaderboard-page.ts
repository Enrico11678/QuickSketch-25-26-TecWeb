import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Navbar } from '../../../dashboard/components/navbar/navbar';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-leaderboard-page',
  standalone: true,
  imports: [Navbar, NgClass],
  templateUrl: './leaderboard-page.html',
  styleUrl: './leaderboard-page.scss',
})
export class LeaderboardPage implements OnInit {
  private statsService = inject(StatsService);
  private route = inject(ActivatedRoute);

  // 'designers' mostra i disegnatori, 'players' mostra gli indovini
  activeTab = signal<'designers' | 'players'>('designers');

  topPlayers = signal<any[]>([]);
  topDesigners = signal<any[]>([]);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'players' || params['tab'] === 'designers') {
        this.activeTab.set(params['tab']);
      }
    })

    this.statsService.getTopPlayers(20).subscribe({
      next: (res) => this.topPlayers.set(res.data.leaderboard),
      error: (err) => console.error(err)
    });

    this.statsService.getTopDesigners(20).subscribe({
      next: (res) => this.topDesigners.set(res.data.leaderboard),
      error: (err) => console.error(err)
    });
  }

  // Funzione per cambiare tab al click
  switchTab(tab: 'designers' | 'players') {
    this.activeTab.set(tab);
  }
}
