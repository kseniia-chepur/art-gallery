import { ArtworkTypes } from '../enums/artwork-types';

export interface Artwork {
  _id: string;
  title: string;
  artist: string;
  type: ArtworkTypes;
  price: number;
  image: string;
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
}
