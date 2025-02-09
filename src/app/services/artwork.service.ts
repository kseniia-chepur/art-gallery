import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Artwork } from '../interfaces/artwork';
import { Observable } from 'rxjs';
import { QueryParams } from '../interfaces/query-params';

@Injectable({
  providedIn: 'root',
})
export class ArtworkService {
  artworks: Artwork[] = [];
  API_URL = 'http://localhost:8000/artworks';

  private http = inject(HttpClient);

  getArtworks(queryParams?: QueryParams): Observable<Artwork[]> {
    let params = new HttpParams();

    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        params = params.set(key, String(queryParams[key as keyof QueryParams]));
      });
    }

    return this.http.get<Artwork[]>(this.API_URL, { params });
  }

  getArtworkById(id: string): Observable<Artwork> {
    return this.http.get<Artwork>(`${this.API_URL}/${id}`);
  }
}
