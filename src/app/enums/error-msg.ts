export enum ErrorMsg {
  TITLE_REQUIRED = 'Title field is required',
  ARTIST_REQUIRED = 'Artist field is required',
  TYPE_REQUIRED = 'Type field is required',
  PRICE_REQUIRED = 'Price field is required',
  PRICE_INVALID = 'Price must be numeric and greater than 0',
  URL_INVALID = 'Image URL is not valid. Supported file formats: .png, .jpg, .jpeg, or .webp',
}
