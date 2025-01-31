import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '../../services/login.service';
import { AlertServiceService } from '../../services/alert-service.service';
import { FullImageComponent } from '../full-image/full-image.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  accountform!: FormGroup;
  editdata: any;
  isLoadingButton = signal<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: LoginService,
    private dialogRef: MatDialogRef<UpdateUserComponent>,
    private formBuilder: FormBuilder,
    private alertService: AlertServiceService,
    private dialog: MatDialog,
    private auth: AuthService
  ) {
    this.accountform = this.formBuilder.group({
      user_id: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      first_name: [{ value: '', disabled: true }],
      last_name: [{ value: '', disabled: true }],
      status: [false],
      contact_no: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      birthdate: [{ value: '', disabled: true }],
      gender: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }],
      profile_pic: [{ value: '', disabled: true }],
      license_no: [{ value: '', disabled: true }],
      license_front: [{ value: '', disabled: true }],
      license_back: [{ value: '', disabled: true }],
      other_id_no: [{ value: '', disabled: true }],
      created_at: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    this.loaduserdata();
  }

  loaduserdata() {
    this.userService.GetUserbyid(this.data.user_id).subscribe((res) => {
      this.editdata = res;

      if (this.editdata && this.editdata.user) {
        this.accountform.patchValue({
          ...this.editdata.user,
        });
      } else {
        console.error('User data not found.');
      }
    });
  }

  onStatusChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.accountform.patchValue({
      status: checkbox.checked,
    });
  }

  openFullView(imageUrl: string): void {
    this.dialog.open(FullImageComponent, {
      data: { imageUrl },
      panelClass: 'full-image-dialog',
      width: '80%',
      height: '80%',
    });
  }

  updateRole(): void {
    const currentRole = this.accountform.get('role')?.value;
    const newRole = currentRole === 'admin' ? 'renter' : 'admin';

    // SweetAlert Confirmation Modal
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to change the user role to ${newRole}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = { role: newRole };

        this.auth.updateRole(this.editdata.user.user_id, payload).subscribe(
          () => {
            this.accountform.patchValue({ role: newRole });
            Swal.fire('Success!', `Role updated to ${newRole}.`, 'success');

            setTimeout(() => {
              window.location.reload();
            }, 2000);
          },
          (error) => {
            console.error('Error updating role:', error);
            Swal.fire('Error', 'There was a problem updating the user role.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The role change was cancelled.', 'info');
      }
    });
  }

  approvedButton() {
    if (!this.data.user_id) {
      Swal.fire('Error', 'User ID not found.', 'error');
      return;
    }

    this.isLoadingButton.set(true);

    this.auth.verifyUser(this.data.user_id).subscribe(
      () => {
        Swal.fire({
          title: 'Are you sure you want to verify the user?',
          showDenyButton: true,
          confirmButtonText: 'Yes',
          denyButtonText: 'No',
        }).then((result) => {
          this.isLoadingButton.set(false);

          if (result.isConfirmed) {
            Swal.fire('Verified!', 'User has been verified.', 'success');
            window.location.reload();
          } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info');
          }
        });
      },
      (error) => {
        console.error(`Error verifying user with ID ${this.data.user_id}:`, error);
        Swal.fire('Error', 'There was a problem verifying the user.', 'error');
        this.isLoadingButton.set(false);
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
