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
import { MatDialogRef } from '@angular/material/dialog';
import { removeWhitespaces } from '../../utils/removeWhitespaces';

@Component({
  selector: 'app-create-artwork',
  imports: [
    ReactiveFormsModule,
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

  private artworkService = inject(ArtworkService);
  private dialogRef = inject(MatDialogRef<CreateArtworkComponent>);

  artworkForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(99)]),
    artist: new FormControl('', [Validators.required]),
    type: new FormControl<ArtworkTypes | null>(null, [Validators.required]),
    price: new FormControl(null, [Validators.required, Validators.min(1)]),
    image: new FormControl(null, Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|webp))$/i)),
    availability: new FormControl<boolean | null>(null),
  });

  onSubmit() {
    const formValues = removeWhitespaces(this.artworkForm.value);

    const filteredValues = removeEmptyFields(formValues);

    this.artworkService.createArtwork(filteredValues).subscribe({
      next: ((data) =>  {
        this.artworkForm.reset();
        this.dialogRef.close(data._id);
      }),
      error: (err) => console.error(err.message),
    });
  }

  onCancel() {
    this.artworkForm.reset();
    this.dialogRef.close();
  }
}
