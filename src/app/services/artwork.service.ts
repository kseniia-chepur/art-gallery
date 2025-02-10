import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Artwork } from '../interfaces/artwork';
import { Observable } from 'rxjs';
import { QueryParams } from '../interfaces/query-params';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArtworkService {
  private apiUrl = environment.API_URL;

  private http = inject(HttpClient);

  createArtwork(artworkData: Partial<Artwork>): Observable<Artwork> {
    return this.http.post<Artwork>(this.apiUrl, artworkData);
  }

  getArtworks(queryParams?: QueryParams): Observable<Artwork[]> {
    let params = new HttpParams();

    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        params = params.set(key, String(queryParams[key as keyof QueryParams]));
      });
    }

    return this.http.get<Artwork[]>(this.apiUrl, { params });
  }

  getArtworkById(id: string): Observable<Artwork> {
    return this.http.get<Artwork>(`${this.apiUrl}/${id}`);
  }

  updateArtwork(id: string, artworkData: Partial<Artwork>): Observable<Artwork> {
    return this.http.put<Artwork>(`${this.apiUrl}/${id}`, artworkData);
  }

  deleteArtwork(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
