import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MotorService } from '../../services/motor.service';

@Component({
  selector: 'app-view-motor',
  templateUrl: './view-motor.component.html',
  styleUrls: ['./view-motor.component.css']
})
export class ViewMotorComponent implements OnInit {
  allcategories: any;
  motorForm: FormGroup;
  isViewOnly = true;

  constructor(
    public dialogRef: MatDialogRef<ViewMotorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categories: MotorService,
    private motorService:MotorService
  ) {
    this.motorForm = new FormGroup({
      plate_no: new FormControl({ value: data?.plate_no, disabled: true }),
      model: new FormControl({ value: data?.model, disabled: true }),
      color: new FormControl({ value: data?.color, disabled: true }),
      cubic_capacity: new FormControl({ value: data?.cubic_capacity, disabled: true }),
      category_id: new FormControl({ value: data?.category_id, disabled: true }),
      price: new FormControl({ value: data?.price, disabled: true }),
      isVisible: new FormControl({ value: data?.isVisible, disabled: this.isViewOnly }),
      description: new FormControl({ value: data?.description, disabled: true }),
      helmet_price: new FormControl({ value: data?.helmet_price, disabled: true }),
      storage_price: new FormControl({ value: data?.storage_price, disabled: true }),
      motor_picture: new FormControl({ value: data?.motor_picture, disabled: true })
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
    
  }

  getAllCategories() {
    this.categories.getAllCategories().subscribe((c) => {
      this.allcategories = c;
    });
  }

  getCategoryName(category_id: string): string {
    const category = this.allcategories?.find((cat: { category_id: string; }) => cat.category_id === category_id);
    return category ? category.category_name : 'Unknown Category';
  }

  toggleEditMode() {
    this.isViewOnly = !this.isViewOnly;
    if (!this.isViewOnly) {
      this.motorForm.enable(); 
    } else {
      this.motorForm.disable(); 
    }
  }

  saveChanges(): void {
    if (this.motorForm.valid) {
      const id = this.data.motor_id;
      const isVisible = this.motorForm.get('isVisible')?.value;

      this.motorService.updateMotorStatus(id, { isVisible }).subscribe(
        (response) => {
          this.dialogRef.close(this.motorForm.value);
        },
        (error) => {
          console.error("Error updating motor status:", error);
        }
      );
    }
  }
  

  close(): void {
    this.dialogRef.close();
  }
}
