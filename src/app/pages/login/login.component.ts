import { Component, OnInit, signal } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../interface/UserModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userInfo: UserModel | null = null;

  constructor(
    private fb: FormBuilder,
    private _auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    const userInfo = this._auth.getUserInfo();
    if (userInfo) {
      this.userInfo = userInfo;
    }
  }

  isLoadingButton = signal<boolean>(false);

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  openForgotPasswordModal() {
    Swal.fire({
      title: 'Forgot Password',
      text: 'Enter your email to reset your password:',
      input: 'email',
      inputPlaceholder: 'Enter your email',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      preConfirm: (email) => {
        if (!email) {
          Swal.showValidationMessage('Email is required');
        } else if (!this.validateEmail(email)) {
          Swal.showValidationMessage('Please enter a valid email address');
        }
        return email;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const email = { email: result.value };
        this.sendForgotPasswordRequest(email);
      }
    });
  }

  sendForgotPasswordRequest(email: any) {
    this._auth.forgotpass(email).subscribe({
      next: () => {
        Swal.fire('Success!', 'Password reset instructions sent to your email.', 'success');
      },
      error: (err) => {
        Swal.fire('Error', err.error.message || 'Failed to send reset email. Please try again.', 'error');
      }
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


















  onSubmit(): void {
    this.isLoadingButton.set(true);
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this._auth.login(email, password).subscribe(
        (response) => {

          if (response.success) {

            Swal.fire({
              title: 'Success!',
              text: 'Login successfully!',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              this.isLoadingButton.set(false);

              this.userInfo = response.user;

              if (this.userInfo?.role === "renter") {
                this.router.navigate(['/']);
              } else if (this.userInfo?.role === "admin") {
                this.router.navigate(['/admin/dashboard']);
              }
            });
          } else {
            Swal.fire({
              title: 'Success',
              text: response.message || 'An error occurred during login.',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              this.isLoadingButton.set(false);

              this.userInfo = response.user;

              if (this.userInfo?.role === "renter") {
                this.router.navigate(['/']);
              } else if (this.userInfo?.role === "admin") {
                this.router.navigate(['/admin/dashboard']);
              }
            });
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while logging in.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          this.isLoadingButton.set(false);

        }
      );
    }
  }
}
