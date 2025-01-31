import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingHistoryService } from '../../services/booking-history.service';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.css']
})
export class ViewBookingComponent {
  bookingId: string | null = null;
  bookingData: any;
  cancel: boolean = false;

  // Adding selected items for helmet and storage
  selected_helmet: boolean = false;
  selected_storage: boolean = false;

  constructor(private bookingHistory: BookingHistoryService, private bookingService: BookingService) {
    this.bookingData = this.bookingHistory.getBookingData();
    this.updateTotalAmount();
  }

  // Method to update the total amount based on selections
  updateTotalAmount() {
    let helmetTotal = 0;
    let storageTotal = 0;

    // Calculate additional helmet cost if selected
    if (this.selected_helmet) {
      helmetTotal = this.bookingData.motor.helmet_price * this.bookingData.days;
    }

    // Calculate additional storage cost if selected
    if (this.selected_storage) {
      storageTotal = this.bookingData.motor.storage_price * this.bookingData.days;
    }

    // Update the total amount
    this.bookingData.total_amount = this.bookingData.motor.price * this.bookingData.days + helmetTotal + storageTotal;
  }

  // Toggle for cancel booking page
  toggleCancelPage() {
    this.bookingService.hidePaymentPage(); 
    this.bookingService.hideBookingPage(); 
    this.bookingService.hideViewBookingPage(); 
    this.bookingService.hideConfirmPage();
    this.bookingService.hideBookingHistoryPage();
    this.bookingService.showCancelBookingPage();
  }

  // Toggle for booking history page
  toggleViewBookingPage() {
    this.bookingService.hideBookingPage();
    this.bookingService.hidePaymentPage();
    this.bookingService.hideConfirmPage();
    this.bookingService.hideCancelBookingPage();
    this.bookingService.hideBookingApprovedPage();
    this.bookingService.hideBookingHistoryPage();
    this.bookingService.hideViewBookingPage();
    this.bookingService.hideViewRentalPage();
    this.bookingService.hideViewRentalPage();
    this.bookingService.hideViewRentalPage();
  
    this.bookingService.showBookingHistoryPage();
  }
}
