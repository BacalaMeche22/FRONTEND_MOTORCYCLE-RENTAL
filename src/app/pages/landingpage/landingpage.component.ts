import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css'],
})
export class LandingpageComponent implements OnInit {
  @ViewChild('aboutSection') aboutSection!: ElementRef;

  showRentalPage = false;
  showBookingPage = false;
  showPaymentPage = false;
  showConfirmPage = false;
  showViewBookingPage = false;
  showCancelBookingPage = false;
  showBookingHistoryPage = false;
  showBookingApprovedPage = false;

  selectedCategory: string = '';

  constructor(private bookingService: BookingService) { }

  ngOnInit() {
    this.bookingService.rentalPageVisibility$.subscribe((visible: boolean) => {
      this.showRentalPage = visible;
    });
    this.bookingService.bookingPageVisible$.subscribe((visible: boolean) => {
      this.showBookingPage = visible;
    });
    this.bookingService.paymentPageVisible$.subscribe((visible: boolean) => {
      this.showPaymentPage = visible;
    });
    this.bookingService.confiramtionPageVisible$.subscribe((visible: boolean) => {
      this.showConfirmPage = visible;
    });
    this.bookingService.viewBookingPageVisible$.subscribe((visible: boolean) => {
      this.showViewBookingPage = visible;
    });
    this.bookingService.CancelBookingPageVisible$.subscribe((visible: boolean) => {
      this.showCancelBookingPage = visible;
    });
    this.bookingService.bookingHistoryPageVisibility$.subscribe((visible: boolean) => {
      this.showBookingHistoryPage = visible;
    });
    this.bookingService.bookingApprovedPageVisibility$.subscribe((visible: boolean) => {
      this.showBookingApprovedPage = visible;
    });
  }

  scrollToSection(section: string) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

  }

  onCategorySelected(categoryName: string): void {
    this.selectedCategory = categoryName;
  }
}
