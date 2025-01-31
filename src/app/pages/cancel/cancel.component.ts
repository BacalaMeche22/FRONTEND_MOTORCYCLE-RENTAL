import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingHistoryService } from '../../services/booking-history.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertServiceService } from '../../services/alert-service.service';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.css'],
})
export class CancelComponent {
  bookingData: any; 
  selectedReason: string = ''; 
  cancelform!: FormGroup;

  constructor(
    private bookingHistory: BookingHistoryService,
    private builder: FormBuilder,
    private alertService: AlertServiceService,
    private bookingService: BookingService,

  ) {
    this.bookingData = this.bookingHistory.getBookingData();

    this.cancelform = this.builder.group({
      pickup_date: [this.bookingData?.pickup_date || ''], 
      return_date: [this.bookingData?.return_date || ''],
      days: [this.bookingData?.days || 0],
      total_amount: [this.bookingData?.total_amount || 0],
      booking_status: ['Cancel'], 
      free_helmet: [this.bookingData?.free_helmet ? 'true' : 'false'],
      second_helmet: [this.bookingData?.second_helmet ? 'true' : 'false'],
      phone_holder: [this.bookingData?.phone_holder ? 'true' : 'false'],
      extra_storage: [this.bookingData?.extra_storage ? 'true' : 'false'],
      payment_method: [this.bookingData?.payment_method || ''],
      motor_id: [this.bookingData?.motor?.motor_id || ''],
      user_id: [this.bookingData?.user?.user_id || ''],
    });
  }

  cancelBooking() {
    if (this.cancelform.invalid) {
      console.error('Form is invalid:', this.cancelform.errors);
      return;
    }

    this.bookingHistory.cancelBooking(this.bookingData.booking_id, this.cancelform.value)
      .subscribe(
        (response: any) => {

          this.alertService.alertWithTimer(
            'success',
            'Success',
            'Booking canceled successfully.'
          );

          this.bookingService.hideBookingPage();
          this.bookingService.hidePaymentPage();
          this.bookingService.hideConfirmPage();
          this.bookingService.hideCancelBookingPage();
          this.bookingService.hideBookingApprovedPage();
          this.bookingService.hideBookingHistoryPage();
          this.bookingService.hideViewRentalPage();
        
          this.bookingService.showBookingHistoryPage();
        },
        (error: any) => {
          console.error('Error cancelling booking:', error);
        }
      );
  }
}
