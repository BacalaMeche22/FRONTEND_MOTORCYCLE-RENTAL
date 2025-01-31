import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-full-image',
  templateUrl: './full-image.component.html',
  styleUrl: './full-image.component.css'
})
export class FullImageComponent {
  constructor(
    public dialogRef: MatDialogRef<FullImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }
  ) {}
}
