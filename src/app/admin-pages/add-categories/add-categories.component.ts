import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrl: './add-categories.component.css',
})
export class AddCategoriesComponent implements OnInit {
  categoryform!: FormGroup;

  constructor(
    private categories: CategoriesService,
    public dialogRef: MatDialogRef<AddCategoriesComponent>
  ) {
    this.categoryform = new FormGroup({
      category_name: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.categoryform.valid) {
      this.categories.addCategory(this.categoryform.value).subscribe({
        next: (response) => {
          this.categories.addCategory(response);

          Swal.fire({
            title: 'Success!',
            text: 'Booking submitted successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.close();
          window.location.reload();
        },
        error: (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'There was a problem submitting the booking.',
            icon: 'error',
            confirmButtonText: 'Try Again',
          });
          console.error('Booking submission error:', error);
        },
      });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all required fields.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
}
