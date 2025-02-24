import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ArtworkService } from '../../services/artwork.service';
import { Artwork } from '../../interfaces/artwork';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KeyValuePipe } from '@angular/common';
import { SortOptions } from '../../enums/sort-options';
import { ArtworkTypes } from '../../enums/artwork-types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QueryParams } from '../../interfaces/query-params';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialog } from '@angular/material/dialog';
import { CreateArtworkComponent } from '../../components/create-artwork/create-artwork.component';
import {
  dialog,
  noImageUrl,
  pageSettings,
} from '../../constants/app-constants';

@Component({
  selector: 'app-artworks',
  imports: [
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    KeyValuePipe,
    CurrencyPipe,
    NgxPaginationModule,
  ],
  templateUrl: './artworks.component.html',
  styleUrl: './artworks.component.scss',
})
export class ArtworksComponent implements OnInit {
  artworks: Artwork[] = [];
  artists: string[] = [];
  isLoading: boolean = false;
  private isInitialLoad: boolean = true;
  readonly noImageUrl: string = noImageUrl.DEFAULT_VALUE;
  readonly artworkTypes = ArtworkTypes;
  readonly sortOptions = SortOptions;
  private queryParams: QueryParams = {};
  readonly pageSize: number = pageSettings.PAGE_SIZE;
  page: number = 1;

  private artworkService = inject(ArtworkService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  filterForm = new FormGroup({
    artist: new FormControl(''),
    type: new FormControl(''),
    price: new FormControl(''),
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = { ...params };

      this.page = this.queryParams.page ? +this.queryParams.page : 1;

      this.filterForm.setValue({
        artist: this.queryParams.artist || '',
        type: this.queryParams.type || '',
        price: this.queryParams.price || '',
      });

      this.fetchArtworks(this.queryParams);
    });
  }

  private fetchArtworks(queryParams: QueryParams = {}): void {
    this.isLoading = this.isInitialLoad;

    this.artworkService
      .getArtworks(queryParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.artworks = data;
          if (!Object.keys(queryParams).length) {
            this.getArtists();
          }
        },
        error: (err) => console.error(err.message),
      })
      .add(() => {
        this.isLoading = false;
        this.isInitialLoad = false;
      });
  }

  private getArtists(): void {
    const artists = this.artworks.map((artwork) => artwork.artist);
    this.artists = [...new Set(artists)];
  }

  onSubmit(): void {
    const formValues = this.filterForm.value;

    if (formValues.artist) {
      this.queryParams.artist = formValues.artist;
    }

    if (formValues.type) {
      this.queryParams.type = formValues.type;
    }

    if (formValues.price) {
      this.queryParams.price = formValues.price;
    }

    this.page = 1;
    this.queryParams.page = this.page;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.queryParams,
      queryParamsHandling: 'merge',
    });

    this.fetchArtworks(this.queryParams);
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.queryParams = {};

    this.router.navigate([], { relativeTo: this.route });

    this.fetchArtworks();
  }

  get isFilterApplied(): boolean {
    return (
      !!this.filterForm.value.artist ||
      !!this.filterForm.value.type ||
      !!this.filterForm.value.price
    );
  }

  onPageChange(page: number): void {
    this.page = page;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.queryParams, page: this.page },
      queryParamsHandling: 'merge',
    });

    this.fetchArtworks(this.queryParams);
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(CreateArtworkComponent, {
      height: dialog.HEIGHT,
      width: dialog.WIDTH,
    });

    dialogRef.afterClosed().subscribe((id) => {
      if (id) {
        this.router.navigate(['/', id]);
      }
    });
  }
}
