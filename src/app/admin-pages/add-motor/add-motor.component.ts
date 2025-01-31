import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MotorService } from '../../services/motor.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-motor',
  templateUrl: './add-motor.component.html',
  styleUrls: ['./add-motor.component.css'],
})
export class AddMotorComponent implements OnInit {
  allcategories: any;
  motorForm!: FormGroup;
  selectedFile: File | null = null;
  downloadURL: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddMotorComponent>,
    private categories: MotorService,
    private storage: AngularFireStorage
  ) {
    this.motorForm = new FormGroup({
      plate_no: new FormControl('', Validators.required),
      model: new FormControl('', Validators.required),
      color: new FormControl('', Validators.required),
      cubic_capacity: new FormControl('', Validators.required),
      category_id: new FormControl('', Validators.required),
      price: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'),
      ]),
      isVisible: new FormControl(false),
      isDelete: new FormControl(false),
      description: new FormControl(''),
      helmet_price: new FormControl(
        null,
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
      ),
      storage_price: new FormControl(
        null,
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
      ),
      motor_picture: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  close(): void {
    this.dialogRef.close();
  }

  getAllCategories() {
    this.categories.getAllCategories().subscribe((c) => {
      this.allcategories = c;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addMotor() {
    if (this.motorForm.valid) {
      if (this.selectedFile) {
        const filePath = `motorcycles/${Date.now()}_${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, this.selectedFile);

        uploadTask.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.downloadURL = url;
              this.submitMotorData(); 
            });
          })
        ).subscribe();
      } else {
        this.submitMotorData();
      }
    }
  }

  submitMotorData() {
    const formData = { ...this.motorForm.value };
    formData.price = +formData.price;
    formData.helmet_price = formData.helmet_price ? +formData.helmet_price : null;
    formData.storage_price = formData.storage_price ? +formData.storage_price : null;

    if (this.downloadURL) {
      formData.motor_picture = this.downloadURL;
    }

    this.categories.addMotor(formData).subscribe(
      (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Motorcycle added successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        window.location.reload();
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'There was a problem adding the motorcycle.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    );
  }
}
