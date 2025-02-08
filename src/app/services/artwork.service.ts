import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Artwork } from '../interfaces/artwork';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArtworkService {
  artworks: Artwork[] = [];
  API_URL = 'http://localhost:8000/artworks';

  private http = inject(HttpClient);

  getArtworks(queryParams?: any): Observable<Artwork[]> {
    let params = new HttpParams();

    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        params = params.set(key, queryParams[key]);
      });
    }

    return this.http.get<Artwork[]>(this.API_URL, { params });
  }
}
