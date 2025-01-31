import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { BookingHistoryService } from '../../services/booking-history.service';
import { AddPaymentComponent } from '../add-payment/add-payment.component';

@Component({
  selector: 'app-add-penalty',
  templateUrl: './add-penalty.component.html',
  styleUrl: './add-penalty.component.css'
})
export class AddPenaltyComponent implements OnInit {
  @Input() bookingId!: string;
  paymentForm: FormGroup;
  isSubmitting = false;
  total: any
  currentDate: string = new Date().toISOString().split('T')[0];

  dropdownOpen = false; // Controls the visibility of the dropdown
  selectedPenalties: string[] = []; // Holds selected penalty types

  constructor(
    private fb: FormBuilder,
    private paymentService: BookingHistoryService,
    private dialogRef: MatDialogRef<AddPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.paymentForm = this.fb.group({
      penalty_amount: [{ value: '', disabled: false }, [Validators.required, Validators.min(1)]],
      penalty_type: [' Overdue', Validators.required],
    });
    this.total = data.total_amount
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onPenaltyChange(event: any, penalty: string) {
    if (event.target.checked) {
      this.selectedPenalties.push(penalty);
    } else {
      this.selectedPenalties = this.selectedPenalties.filter((item) => item !== penalty);
    }
  
    this.paymentForm.get('penalty_type')?.setValue(this.selectedPenalties.join(', '));
  }

  ngOnInit(): void {
    if (this.data?.total_amount) {
      this.paymentForm.get('total_amount')?.setValue(this.data.total_amount);
    }
  }

  submitPayment() {
    this.paymentForm.get('total_amount')?.setValue(this.total);
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit this payment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {

        const paymentData = this.paymentForm.value;

        this.paymentService.addPenalty(this.data.booking_id, paymentData).subscribe({
          next: () => {
            Swal.fire('Success!', 'Penalty has been submitted.', 'success');

            setTimeout(() => {
              this.dialogRef.close(true);
              window.location.reload();
            }, 2000);
          },
          error: (error) => {
            console.error('Error submitting payment:', error);
            Swal.fire('Error!', 'There was an error submitting the payment.', 'error');
          },
        });
      }
    });
  }




  cancel() {
    this.dialogRef.close(false);
  }
}
