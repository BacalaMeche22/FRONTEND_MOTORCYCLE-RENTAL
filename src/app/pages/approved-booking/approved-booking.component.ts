import { Component, signal } from '@angular/core';
import { BookingHistoryService } from '../../services/booking-history.service';
import { BookingService } from '../../services/booking.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approved-booking',
  templateUrl: './approved-booking.component.html',
  styleUrl: './approved-booking.component.css'
})
export class ApprovedBookingComponent {
  bookingId: string | null = null;
  bookingData: any;

  constructor(private bookingHistory: BookingHistoryService, private bookingService: BookingService, private router: Router) {
    this.bookingData = this.bookingHistory.getBookingData();

    
    
    if (!this.bookingData) {
    }

    setTimeout(() => {
      this.bookingData = this.bookingHistory.getBookingData();
  }, 100);
  }

  toggleCancelPage() {
    this.bookingService.hidePaymentPage(); 
    this.bookingService.hideCancelBookingPage(); 
    this.bookingService.hideBookingPage(); 
    this.bookingService.showBookingApprovedPage(); 
    this.bookingService.hideViewBookingPage(); 
    this.bookingService.hideConfirmPage();
    this.bookingService.hideBookingHistoryPage();
    this.bookingService.showCancelBookingPage();
  }

  isLoadingButton = signal<boolean>(false);


  approvedButton() {
    this.isLoadingButton.set(true);
    if (!this.bookingData?.booking_id) {
      Swal.fire('Error', 'Booking ID is missing.', 'error');
      this.isLoadingButton.set(false);

      return;
    }
  
    this.bookingHistory.rent(this.bookingData.booking_id).subscribe(
      () => {
       
        Swal.fire({
          title: "Are you sure you want to proceed to rent?",
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "Yes",
          denyButtonText: `No`
        }).then((result) => {
          this.isLoadingButton.set(false);
          
          if (result.isConfirmed) {
            Swal.fire("Saved!", "", "success");
            this.router.navigate(['/']); 
            window.location.reload()
          } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
            this.isLoadingButton.set(false);

          }
        });
      },
      (error) => {
        console.error(`Error approving booking with ID ${this.bookingData.booking_id}:`, error);
        Swal.fire('Error', 'There was a problem approving the booking.', 'error');
      }
    );
  }

  toggleViewBookingPage() {
    this.bookingService.hideBookingPage();
    this.bookingService.hidePaymentPage();
    this.bookingService.hideConfirmPage();
    this.bookingService.hideCancelBookingPage();
    this.bookingService.hideBookingApprovedPage();
    this.bookingService.hideBookingHistoryPage();
    this.bookingService.hideViewRentalPage(); 
    this.bookingService.hideViewRentalPage(); 
  
    this.bookingService.showBookingHistoryPage();
  }
  
  
    
}
