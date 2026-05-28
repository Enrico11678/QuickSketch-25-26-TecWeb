import { Component } from '@angular/core';
import { Navbar } from '../dashboard/components/navbar/navbar';
import { GalleryCard } from '../dashboard/components/gallery-card/gallery-card';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [Navbar, GalleryCard],
  templateUrl: './gallery-page.html',
  styleUrl: './gallery-page.scss',
})
export class GalleryPage {}
