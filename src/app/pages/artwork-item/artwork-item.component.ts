import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { Artwork } from '../../interfaces/artwork';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AvailabilityTypes } from '../../enums/availability-types';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-artwork-item',
  imports: [MatCardModule, MatButtonModule, CurrencyPipe],
  templateUrl: './artwork-item.component.html',
  styleUrl: './artwork-item.component.scss',
})
export class ArtworkItemComponent implements OnInit {
  private artworkService = inject(ArtworkService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  id: string = '';
  artwork: Artwork | null = null;
  readonly noImageUrl: string = 'assets/images/no-image.png';
  status: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.id = id;
        this.artworkService
          .getArtworkById(this.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (data) => {
              this.artwork = data;
              this.getStatus();
            },
            error: (err) => console.error(err.message),
          });
      }
    });
  }

  getStatus() {
    this.status =
      this.artwork?.availability === true
        ? AvailabilityTypes.AVAILABLE
        : this.artwork?.availability === false
        ? AvailabilityTypes.NOT_AVAILABLE
        : AvailabilityTypes.NO_INFORMATION;
  }

  onDelete() {
    this.artworkService.deleteArtwork(this.id).subscribe({
      next: () => {
        (this.artwork = null), this.router.navigate(['/']);
      },
      error: (err) => console.error(err.message),
    });
  }
}
