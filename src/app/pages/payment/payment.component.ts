import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserModel } from '../../interface/UserModel';
import { AuthService } from '../../services/auth.service';
import { BookingHistoryService } from '../../services/booking-history.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  bookingSummary: any;
  selectedMotor: any;
  paymentform: FormGroup;
  userInfo: UserModel | null = null;
  gcashQRCode?: string =
    'https://firebasestorage.googleapis.com/v0/b/motorcycle-rental-f63ac.appspot.com/o/462577444_1536795320368085_4482874328697496544_n.jpg?alt=media&token=4b373362-30ac-4757-83f6-a79330a6a7c7';
  isGcashModalOpen = false;
  showGcashReferenceInput = false;
  selectedPaymentMethod = false;

  constructor(
    private bookingService: BookingService,
    public formbuilder: FormBuilder,
    private auth: AuthService,
    private bookinghistory: BookingHistoryService,
    private router: Router
  ) {
    this.paymentform = this.formbuilder.group({
      pickup_date: [''],
      start_booking: [''],
      return_date: [''],
      end_booking: [''],
      is_rent: ['false'],
      days: [0],
      total_amount: [0],
      booking_status: ['pending'],
      reference_link: ['no reference number'], 
      remark: [''],
      paid_status: [''],
      return_status: ['Not Returned'],
      free_helmet: ['false'],
      second_helmet: ['false'],
      phone_holder: ['false'],
      extra_storage: ['false'],
      penalty_type: ['None'],
      payment_method: ['', Validators.required],
      motor_id: ['', Validators.required],
      user_id: ['', Validators.required],
    });

    this.loadAllBookings();
  }

  ngOnInit(): void {
    this.userInfo = this.auth.getUserInfo();

    this.paymentform.get('payment_method')?.valueChanges.subscribe((value) => {
      const paymentMethod = value?.toLowerCase(); 

      if (paymentMethod === 'gcash e-wallet') {
        this.paymentform.get('reference_link')?.setValue(''); 
        this.paymentform.get('paid_status')?.setValue(' PAID ');  
      } else if (paymentMethod === 'cash') {
        this.paymentform.get('reference_link')?.setValue('no reference number'); 
        this.paymentform.get('paid_status')?.setValue(' UNPAID ');  
      } 
    });



    this.populateBookingDetails();
  }

  openGcashModal() {
    this.isGcashModalOpen = true;
    this.showGcashReferenceInput = true;
    this.selectedPaymentMethod = false;
  }

  openPickOp() {
    this.selectedPaymentMethod = true;
    this.showGcashReferenceInput = false;
  }

  closeGcashModal() {
    this.isGcashModalOpen = false;
  }

  populateBookingDetails() {
    this.bookingSummary = this.bookingService.getBookingSummary();

    this.selectedMotor = this.bookingService.getCurrentMotor();

    if (this.userInfo) {
      this.paymentform.patchValue({
        pickup_date: this.bookingSummary?.pickupDate,
        start_booking: this.bookingSummary?.pickupTime,
        return_date: this.bookingSummary?.returnDate,
        end_booking: this.bookingSummary?.returnTime,
        days: this.bookingSummary?.days,
        total_amount: this.bookingSummary?.total,
        motor_id: this.selectedMotor?.motor_id,
        user_id: this.userInfo.user_id,
        free_helmet: this.bookingSummary?.helmet === 'Free' ? 'true' : 'false',
        second_helmet: this.bookingSummary?.helmet_price ? 'true' : 'false',
        phone_holder: this.bookingSummary?.phoneHolder ? 'true' : 'false',
        extra_storage: this.bookingSummary?.storage_price ? 'true' : 'false',
      });
    }
  }

  loadAllBookings() {
    this.bookinghistory.getAllBookingHistory().subscribe((res: any[]) => {});
  }

  onSubmit() {
    if (this.paymentform.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill out all required fields correctly.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.bookinghistory
      .getAllBookingHistory()
      .pipe(
        map((bookings: any[]) =>
          bookings.some(
            (booking) =>
              booking.user.user_id === this.userInfo?.user_id &&
              booking.return_status === 'Not Returned'
          )
        )
      )
      .subscribe((hasPendingReturn) => {
        if (hasPendingReturn) {
          Swal.fire({
            title: 'Booking Not Allowed',
            text: 'You cannot book a new motorcycle because one is still not returned.',
            icon: 'warning',
            confirmButtonText: 'OK',
          });
        } else {
          const paymentMethod = this.paymentform.get('payment_method')?.value;

          if (paymentMethod === 'Gcash e-Wallet') {
            Swal.fire({
              title: 'Confirm Reference Number',
              text: 'Are you sure you\'ve entered the correct reference number?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'YES',
              cancelButtonText: 'NO',
            }).then((result) => {
              if (result.isConfirmed) {
                this.proceedWithBooking();
              }
            });
          } else if (paymentMethod === 'cash') {
            Swal.fire({
              title: '<h3>PAYMENT CONFIRMATION</h3>',
              html: `
                <p>Fees must be settled within the scheduled date & time of the booking. If payment is not received, the reservation will be canceled.</p>
                <label style="display: flex; align-items: center; margin-top: 10px;">
                  <input type="checkbox" id="agreeCheckbox" style="margin-right: 5px;" />
                  <span>I AGREE</span>
                </label>
              `,
              showCancelButton: true,
              cancelButtonText: 'CANCEL',
              confirmButtonText: 'SUBMIT',
              preConfirm: () => {
                const agreeCheckbox = document.getElementById(
                  'agreeCheckbox'
                ) as HTMLInputElement;
                if (!agreeCheckbox || !agreeCheckbox.checked) {
                  Swal.showValidationMessage(
                    'You need to agree before submitting.'
                  );
                  return false; 
                }
                return agreeCheckbox?.checked;
              },
            }).then((result) => {
              if (result.isConfirmed) {
                this.proceedWithBooking();
              }
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Please select a valid payment method.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        }
      });
  }

  proceedWithBooking() {
    const bookingDetails = this.paymentform.value;
    this.bookingService.addBooking(bookingDetails).subscribe(
      (res: any) => {
        const bookingId = res?.booking_id;
  
        this.bookingService.setBookingId(bookingId);
  
        Swal.fire({
          title: 'Success',
          text: `Your booking has been successfully submitted! Booking ID: ${bookingId}`,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.bookingService.showConfirmPage();
          this.bookingService.hidePaymentPage();
        });
      },
      (err) => {
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while processing your booking.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
  

  back() {
    this.bookingService.showBookingPage();
  }

  toggleViewBookingPage() {
    this.bookingService.hideBookingPage();
    this.bookingService.hidePaymentPage();
    this.bookingService.hideConfirmPage();
    this.bookingService.hideCancelBookingPage();
    this.bookingService.hideBookingApprovedPage();
    this.bookingService.hideBookingHistoryPage();
    this.bookingService.hideViewRentalPage(); 
    this.bookingService.hideConfirmPage(); 
  
    this.bookingService.showBookingHistoryPage();
  }

  get pickupTimeFormatted(): Date | null {
    if (this.bookingSummary?.pickupTime) {
      return new Date(`1970-01-01T${this.bookingSummary.pickupTime}:00`);
    }
    return null;
  }
  
  get returnTimeFormatted(): Date | null {
    if (this.bookingSummary?.returnTime) {
      return new Date(`1970-01-01T${this.bookingSummary.returnTime}:00`);
    }
    return null;
  }

}
