import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../interface/UserModel';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertServiceService } from '../../services/alert-service.service';
import { LoginService } from '../../services/login.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  userInfo: UserModel | null = null;
  accountform!: FormGroup;
  passwordForm!: FormGroup; 
  userId: any | null = null;
  editdata: any;
  originalPassword: string | null = null; 
  disable: boolean = false; 

  selectedFile: File | null = null;
  defaultProfileImage: any | null = null;

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private alertService: AlertServiceService,
    private userService: LoginService,
    private storage: AngularFireStorage
  ) {
    this.userInfo = this.auth.getUserInfo(); 

    this.accountform = this.formBuilder.group({
      email: [{ value: '', disabled: this.disable }],
      first_name: [{ value: '', disabled: this.disable }],
      last_name: [{ value: '', disabled: this.disable }],
      status: [{ value: false, disabled: this.disable }],
      role: [{ value: '', disabled: this.disable }],
      contact_no: [{ value: '', disabled: this.disable }],
      address: [{ value: '', disabled: this.disable }],
      birthdate: [{ value: '', disabled: this.disable }],
      gender: [{ value: '', disabled: this.disable }],
      license_no: [{ value: '', disabled: this.disable }],
      other_id_no: [{ value: '', disabled: this.disable }],
      password: [{ value: '', disabled: this.disable }],
    });

    this.passwordForm = this.formBuilder.group({
      password: ['']
    });
  }

  ngOnInit() {
    this.userInfo = this.auth.getUserInfo(); 
    if (this.userInfo) {
      this.loaduserdata();
    } else {
      console.error('User not authenticated or info not available.');
    }
  }

  loaduserdata() {
    this.userId = this.userInfo?.user_id || null;
    this.defaultProfileImage =  this.userInfo?.profile_pic || null;
    if (!this.userId) {
      console.error("User ID is null, cannot fetch user data.");
      return;
    }

    this.userService.GetUserbyid(this.userId).subscribe((res) => {
      this.editdata = res;
      this.originalPassword = this.editdata.user.password;
      this.accountform.patchValue(this.editdata.user);
    });
  }

  enableEdit() {
    this.disable = !this.disable;
    Object.keys(this.accountform.controls).forEach(control => {
      if (control !== 'user_id' && control !== 'profile_pic' && control !== 'license_front' && control !== 'license_back') {
        this.accountform.get(control)?.enable({ emitEvent: false });
      }
    });

    if (this.disable) {
      this.accountform.disable();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.userInfo!.profile_pic = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }


  updateUser() {
    if (this.accountform.valid) {
      const userData = { ...this.accountform.value };
  
      if (userData.password === this.originalPassword) {
        delete userData.password;
      }
  
      if (this.selectedFile) {
        const filePath = `profile_images/${this.userId}_${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, this.selectedFile);
  
        uploadTask.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              userData.profile_pic = url; 
  
              this.userService.updateuser(this.userId, userData).subscribe(
                (response) => {
                  this.alertService.alertWithTimer('success', 'Success', 'Updated successfully.');
                  this.loaduserdata();
                  this.enableEdit(); 
                },
                (error) => {
                  console.error('Error updating user information', error);
                  this.alertService.alertWithTimer('error', 'Error', 'Failed to update.');
                }
              );
            });
          })
        ).subscribe();
      } else {
        this.userService.updateuser(this.userId, userData).subscribe(
          (response) => {
            this.alertService.alertWithTimer('success', 'Success', 'Updated successfully.');
            this.loaduserdata();
            this.enableEdit();
          },
          (error) => {
            console.error('Error updating user information', error);
            this.alertService.alertWithTimer('error', 'Error', 'Failed to update.');
          }
        );
      }
    }
  }
  
  

  changePassword(newPassword: string, confirmPassword: string) {
    if (newPassword !== confirmPassword) {
      this.alertService.alertWithTimer('error', 'Error', 'Your new password and confirmed password do not match.');
      return;
    }

    this.accountform.patchValue({ password: newPassword });

    this.userService.updateuser(this.userId, this.accountform.value).subscribe(
      response => {
        this.alertService.alertWithTimer('success', 'Success', 'Password updated successfully.');
        window.location.reload();
      },
      error => {
        this.alertService.alertWithTimer('error', 'Error', 'Failed to update password.');
      }
    );
  }
}
