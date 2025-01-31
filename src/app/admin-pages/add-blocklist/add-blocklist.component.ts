import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { BlocklistService } from '../../services/blocklist.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-blocklist',
  templateUrl: './add-blocklist.component.html',
  styleUrls: ['./add-blocklist.component.css']
})
export class AddBlocklistComponent implements OnInit {
  blocklistForm: FormGroup; 
  users: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: LoginService,
    private blockuser:BlocklistService,
    public dialogRef: MatDialogRef<AddBlocklistComponent>
  ) {
    this.blocklistForm = this.fb.group({
      user_id: ['', Validators.required],
      message: ['', Validators.required],
      block_status: [true]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUser().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.blocklistForm.valid) {
      this.blocklistForm.get('block_status')?.setValue(true);
      this.blockuser.blockuser(this.blocklistForm.value).subscribe({
        next: (response) => {
          this.blockuser.blockuser(response);

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
