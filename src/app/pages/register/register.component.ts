import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { RegistrationService } from '../../services/registration.service';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  
  readonly startDate = new Date(1990, 0, 1);
  profile_pic: string = 'https://firebasestorage.googleapis.com/v0/b/mobi-pms.appspot.com/o/motors%2Favatar.png?alt=media&token=139a35e0-0ddc-42e2-823f-45a120126aca';
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = signal('');

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  private _formBuilder = inject(FormBuilder);
  isEditable = false;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  licenseFrontFile: File | null = null;
  licenseBackFile: File | null = null;
  otherIdFile: File | null = null;

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private storage: AngularFireStorage 
  ) {
    this.firstFormGroup = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact_no: [''],
      address: ['', Validators.required],
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      profile_pic: [this.profile_pic],
      role: ['renter'],
    });
    this.thirdFormGroup = this._formBuilder.group({
      license_no: ['', Validators.required],
      license_front: ['', Validators.required],
      license_back: ['', Validators.required],
      other_id_no: ['', Validators.required],
      other_id: ['', Validators.required],
    });

    merge(this.email.statusChanges, this.email.valueChanges).subscribe(() => this.updateErrorMessage());
  }

  ngOnInit(): void {}

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  onLicenseFrontSelected(event: any) {
    this.licenseFrontFile = event.target.files[0];
  }

  onLicenseBackSelected(event: any) {
    this.licenseBackFile = event.target.files[0];
  }

  onOtherIdSelected(event: any) {
    this.otherIdFile = event.target.files[0];
  }

  isLoadingButton = signal<boolean>(false);


  onSubmit(): void {
    this.isLoadingButton.set(true);

    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid) {
      this.uploadFilesAndSubmitForm();
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all required fields.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      this.isLoadingButton.set(false);

    }
  }

  private uploadFilesAndSubmitForm(): void {
    const uploadTasks = [
      this.uploadFile(this.licenseFrontFile, 'license_front'),
      this.uploadFile(this.licenseBackFile, 'license_back'),
      this.uploadFile(this.otherIdFile, 'other_id'),
    ];

    Promise.all(uploadTasks).then((urls) => {
      const formData = {
        ...this.firstFormGroup.value,
        ...this.secondFormGroup.value,
        ...this.thirdFormGroup.value,
        license_front: urls[0],
        license_back: urls[1],
        other_id: urls[2],
      };

      this.registrationService.submitForm(formData).subscribe(
        (response) => {
          Swal.fire({
            title: 'Success!',
            text: 'Registration submitted successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.isLoadingButton.set(false);

            this.router.navigate(['/login']);
          });
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'There was a problem submitting the form.',
            icon: 'error',
            confirmButtonText: 'Try Again',
          });
          this.isLoadingButton.set(false);

        }
      );
    });
  }

  private uploadFile(file: File | null, field: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(''); 
        return;
      }
      const filePath = `uploads/${field}/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file);

      uploadTask.snapshotChanges()
        .pipe(finalize(() => fileRef.getDownloadURL().subscribe(resolve, reject)))
        .subscribe();
    });
  }
}
