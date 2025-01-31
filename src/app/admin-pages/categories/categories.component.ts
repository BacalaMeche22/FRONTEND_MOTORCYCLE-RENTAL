import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { AddCategoriesComponent } from '../add-categories/add-categories.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateCategoryComponent } from '../update-category/update-category.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CATEGORIESComponent implements OnInit {
  allcategories:any

  constructor(private categories:CategoriesService,private dialog: MatDialog){}


  ngOnInit(): void {
    this.loadAllCategories()
  }

  loadAllCategories(): void {
    this.categories.getAllCategories().subscribe(
      (data) => {
        this.allcategories = data;
      },
      (error) => {
      }
    );
  }

  openAddCategoryDialog(): void {
    this.dialog.open(AddCategoriesComponent, {
      width: 'auto', 
      panelClass: 'custom-dialog'
    });
  }
  selectedCategory: any;
  categoryID: any;

  openUpdateCategorygDialog(categoryId: string) {
    const selectedBooking = this.allcategories.find(
      (category: any) => category.category_id === categoryId
    );

    if (selectedBooking) {
      this.selectedCategory = selectedBooking; 
      const dialogRef = this.dialog.open(UpdateCategoryComponent, {
        width: 'auto',
        height: 'auto',
        panelClass: 'custom-dialog',
        data: selectedBooking,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          
        }
      });
    }
  }


  deleteCategory(categoryId: string): void {
    Swal.fire({
      title: 'Are you sure you want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.categories.deleteCategory(categoryId).subscribe(
          () => {
            Swal.fire('Deleted!', 'The category has been deleted.', 'success');
            this.loadAllCategories(); // Refresh the list
          },
          (error) => {
            console.error(`Error deleting category with id ${categoryId}:`, error);
            Swal.fire('Error', 'There was a problem deleting the motor.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The category was not deleted.', 'info');
      }
    });
  }

}
