import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriesService } from '../../services/categories.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.css'
})
export class UpdateCategoryComponent implements OnInit{
  updateCategoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private dialogRef: MatDialogRef<UpdateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    this.updateCategoryForm = this.fb.group({
      category_name: [data.category_name, Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.updateCategoryForm.valid) {
      const updatedData = this.updateCategoryForm.value;
      this.categoriesService.updateCategory(this.data.category_id, updatedData)
        .subscribe(
          (response) => {
            Swal.fire({
              title: 'Success!',
              text: 'Update successfully!',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(()=>{
              window.location.reload()
            })
          }
        );
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
