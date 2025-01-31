import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookingPageVisibility = new BehaviorSubject<boolean>(false);
  private bookingApprovedPageVisibility = new BehaviorSubject<boolean>(false);
  private paymentPageVisibility = new BehaviorSubject<boolean>(false);
  private confirmationPageVisibility = new BehaviorSubject<boolean>(false);
  private viewBookingPageVisibility = new BehaviorSubject<boolean>(false);
  private cancelBookingPageVisibility = new BehaviorSubject<boolean>(false);
  private bookingHistoryPageVisibility = new BehaviorSubject<boolean>(false);
  private rentalPageVisibility = new BehaviorSubject<boolean>(false);

  private currentMotor: any = null;
  private bookingSummary: any;

  bookingPageVisible$ = this.bookingPageVisibility.asObservable();
  paymentPageVisible$ = this.paymentPageVisibility.asObservable();
  confiramtionPageVisible$ = this.confirmationPageVisibility.asObservable();
  viewBookingPageVisible$ = this.viewBookingPageVisibility.asObservable();
  CancelBookingPageVisible$ = this.cancelBookingPageVisibility.asObservable();
  bookingHistoryPageVisibility$ = this.bookingHistoryPageVisibility.asObservable();
  bookingApprovedPageVisibility$ = this.bookingApprovedPageVisibility.asObservable();
  rentalPageVisibility$ = this.rentalPageVisibility.asObservable();

  private selectedMotorId: string | null = null;
  private pickupDate: string | null = null;
  private returnDate: string | null = null;
  private bookingResponse: any;

  private bookingIdSubject = new BehaviorSubject<string | null>(null);
bookingId$ = this.bookingIdSubject.asObservable();

setBookingId(bookingId: string) {
  this.bookingIdSubject.next(bookingId);
}

getBookingId(): string | null {
  return this.bookingIdSubject.value;
}

  public bookingurl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  setBookingResponse(response: any) {
    this.bookingResponse = response;
  }

  getBookingResponse() {
    return this.bookingResponse;
  }

  public addBooking(bookingdata: any): Observable<any> {
    return this.http.post(`${this.bookingurl}/booking/book`, bookingdata);
  }

  setCurrentMotor(motor: any) {
    this.currentMotor = motor;
  }

  getCurrentMotor() {
    return this.currentMotor;
  }

  setBookingDetails(motorId: string, pickup: string, returnDate: string) {
    this.selectedMotorId = motorId;
    this.pickupDate = pickup;
    this.returnDate = returnDate;
  }

  getBookingDetails() {
    return {
      motorId: this.selectedMotorId,
      pickupDate: this.pickupDate,
      returnDate: this.returnDate,
    };
  }

  setBookingSummary(summary: any) {
    this.bookingSummary = summary;
  }

  getBookingSummary() {
    return this.bookingSummary;
  }

  // Page visibility methods
  showBookingPage() {
    this.bookingPageVisibility.next(true);
  }

  hideBookingPage() {
    this.bookingPageVisibility.next(false);
  }

  showBookingApprovedPage() {
    this.bookingApprovedPageVisibility.next(true);
  }

  hideBookingApprovedPage() {
    this.bookingApprovedPageVisibility.next(false);
  }

  showPaymentPage() {
    this.paymentPageVisibility.next(true);
  }

  hidePaymentPage() {
    this.paymentPageVisibility.next(false);
  }

  showConfirmPage() {
    this.confirmationPageVisibility.next(true);
  }

  hideConfirmPage() {
    this.confirmationPageVisibility.next(false);
  }

  showViewRentalPage() {
    this.rentalPageVisibility.next(true);
  }

  hideViewRentalPage() {
    this.rentalPageVisibility.next(false);
  }

  showViewBookingPage() {
    this.viewBookingPageVisibility.next(true);
  }

  hideViewBookingPage() {
    this.viewBookingPageVisibility.next(false);
  }

  showCancelBookingPage() {
    this.cancelBookingPageVisibility.next(true);
  }

  hideCancelBookingPage() {
    this.cancelBookingPageVisibility.next(false);
  }

  showBookingHistoryPage() {
    this.bookingHistoryPageVisibility.next(true);
  }

  hideBookingHistoryPage() {
    this.bookingHistoryPageVisibility.next(false);
  }


 
}
