import { Artwork } from '../interfaces/artwork';

export function removeWhitespaces(
  formValues: Record<string, unknown>
): Partial<Artwork> {
  const values: Record<string, unknown> = {};

  for (const key in formValues) {
    if (formValues.hasOwnProperty(key)) {
      const value = formValues[key];

      values[key] = typeof value === 'string' ? value.trim() : value;
    }
  }
  return values;
}
