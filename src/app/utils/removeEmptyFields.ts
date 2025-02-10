import { Artwork } from "../interfaces/artwork";

export function removeEmptyFields(formValues: Partial<Artwork>): Partial<Artwork> {
  return Object.fromEntries(
    Object.entries(formValues).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ''
    )
  );
}
