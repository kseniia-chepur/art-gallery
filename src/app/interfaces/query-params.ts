import { ArtworkTypes } from '../enums/artwork-types';

export interface QueryParams {
  artist?: string;
  type?: ArtworkTypes;
  price?: 'asc' | 'desc';
}
