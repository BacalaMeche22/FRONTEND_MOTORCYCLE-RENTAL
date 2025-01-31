import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { BookingHistoryService } from '../../services/booking-history.service';
import { RentalReceiptComponent } from '../rental-receipt/rental-receipt.component';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css'],
})
export class AddPaymentComponent implements OnInit {
  @Input() bookingId!: string;
  paymentForm: FormGroup;
  isSubmitting = false;
  total: any;
  currentDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private paymentService: BookingHistoryService,
    private dialogRef: MatDialogRef<AddPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private bookingData: BookingHistoryService
  ) {
    this.paymentForm = this.fb.group({
      total_amount: [
        { value: '', disabled: true },
        [Validators.required, Validators.min(1)],
      ],
      payment_method: ['Over the Counter', Validators.required],
      date_of_payment: [
        { value: this.currentDate, disabled: true },
        Validators.required,
      ],
    });
    this.total = data.total_amount;
  }

  ngOnInit(): void {
    if (this.data?.total_amount) {
      this.paymentForm.get('total_amount')?.setValue(this.data.total_amount);
    }

    this.loadAllData();
  }

  bookingDetails: any;

  loadAllData() {
    this.bookingData.GetBookingbyid(this.data.booking_id).subscribe((res) => {
      this.bookingDetails = res;
    });
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

        this.paymentService
          .addPayment(this.data.booking_id, paymentData)
          .subscribe({
            next: () => {
              Swal.fire('Success!', 'Payment has been submitted.', 'success').then(() => {
             
                this.dialog.open(RentalReceiptComponent, {
                  width: '600px',
                  data: {
                    booking_id: this.data.booking_id,
                    bookingDetails: this.bookingDetails,
                  },
                });

              
                this.dialogRef.close(true);
              });
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
