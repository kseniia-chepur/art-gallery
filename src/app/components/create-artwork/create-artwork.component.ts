import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
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
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-artwork',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    KeyValuePipe,
  ],
  templateUrl: './create-artwork.component.html',
  styleUrl: './create-artwork.component.scss',
})
export class CreateArtworkComponent {
  artworkTypes = ArtworkTypes;
  readonly availabiltyOptions = availability;
  readonly errorMsg = ErrorMsg;
  private id = '';

  private artworkService = inject(ArtworkService);
   private dialogRef = inject(MatDialogRef<CreateArtworkComponent>);

  artworkForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(99)]),
    artist: new FormControl('', [Validators.required]),
    type: new FormControl<ArtworkTypes | null>(null, [Validators.required]),
    price: new FormControl(null, [Validators.required, Validators.min(1)]),
    image: new FormControl(
      null,
      Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|webp))$/i)
    ),
    availability: new FormControl<boolean | null>(null),
  });

  onSubmit() {
    const formValues = this.artworkForm.getRawValue();

    const filteredValues = removeEmptyFields(formValues);

    this.artworkService.createArtwork(filteredValues).subscribe({
      next: ((data) => {
        this.id = data._id,
         this.dialogRef.close(this.id);
       }),
      error: (err) => console.error(err.message),
    });

    this.artworkForm.reset();
  }

  onCancel() {
    this.artworkForm.reset();
    this.dialogRef.close();
  }
}
