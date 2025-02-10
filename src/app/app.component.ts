import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateArtworkComponent } from "./components/create-artwork/create-artwork.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'art-gallery';
}
