import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-action-panel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './action-panel.html',
  styleUrl: './action-panel.scss',
})
export class ActionPanel {}
