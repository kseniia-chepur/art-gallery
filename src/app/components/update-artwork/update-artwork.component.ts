import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { KeyValuePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ArtworkTypes } from '../../enums/artwork-types';
import { availability } from '../../constants/availability';
import { ErrorMsg } from '../../enums/error-msg';
import { ArtworkService } from '../../services/artwork.service';
import { removeEmptyFields } from '../../utils/removeEmptyFields';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Artwork } from '../../interfaces/artwork';

@Component({
  selector: 'app-update-artwork',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    KeyValuePipe,
  ],
  templateUrl: './update-artwork.component.html',
  styleUrl: './update-artwork.component.scss',
})
export class UpdateArtworkComponent {
  artworkTypes = ArtworkTypes;
  readonly availabiltyOptions = availability;
  readonly errorMsg = ErrorMsg;

  private artworkService = inject(ArtworkService);
  private dialogRef = inject(MatDialogRef<UpdateArtworkComponent>);
  private data = inject<Artwork>(MAT_DIALOG_DATA);

  artwork: Artwork = this.data;

  updateForm = new FormGroup({
  title: new FormControl(this.artwork.title, [Validators.required, Validators.maxLength(99)]),
  artist: new FormControl(this.artwork.artist, [Validators.required]),
  type: new FormControl<ArtworkTypes | null>(this.artwork.type, [Validators.required]),
  price: new FormControl(this.artwork.price, [Validators.required, Validators.min(1)]),
  image: new FormControl(this.artwork.image, Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|webp))$/i)),
  availability: new FormControl<boolean | null>(this.artwork.availability),
  });

    onSubmit() {
    const formValues = this.updateForm.getRawValue();
    const filteredValues = removeEmptyFields(formValues);

    this.artworkService.updateArtwork(this.artwork._id, filteredValues).subscribe({
      next: (() => {
        this.updateForm.reset();
        this.dialogRef.close();
      }),
      error: (err) => console.error(err.message),
    });
  }

  onCancel() {
    this.updateForm.reset();
    this.dialogRef.close();
  }
}
