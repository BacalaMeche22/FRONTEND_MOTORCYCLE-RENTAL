import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingHistoryService {
  private url = environment.baseUrl;
  private baseUrl = 'http://localhost:3000/booking'
  private bookingData: any;

  constructor(private http: HttpClient) { }

  public getAllBookingHistory(): Observable<any> {
    return this.http.get(this.url + '/booking');
  }

  public getAllPickupDate(): Observable<any> {
    return this.http.get(this.url + '/booking/pickup-date-bookings');

  }

  public getAllBookingPending(): Observable<any> {
    return this.http.get(this.url + '/booking/pending-bookings/count');
  }

  public getAllBookingRenting(): Observable<any> {
    return this.http.get(this.url + '/booking/is-rent-true/count');
  }

  setBookingData(booking: any) {
    this.bookingData = booking;
  }

  getBookingData() {
    return this.bookingData;
  }


  cancelBooking(bookingId: string, updateData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/book/${bookingId}`, updateData);
  }

  public GetBookingbyid(id: any) {
    return this.http.get(this.url + '/booking/' + id);
  }

  public getNotification() {
    return this.http.get(this.url + '/booking/admin-notifications');
  }

  public updateBooking(bookingId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.url}/booking/book/${bookingId}`, updatedData);
  }



  public updateReturn(id: any, updatedData: any) {
    return this.http.put(`${this.url}/booking/return/${id}`, updatedData);

  }

  approveBooking(id: string): Observable<any> {
    return this.http.put(`${this.url}/booking/${id}/approve`, {});
  }

  rent(id: string): Observable<any> {
    return this.http.put(`${this.url}/booking/${id}/rent`, {});
  }

  declined(id: string): Observable<any> {
    return this.http.put(`${this.url}/booking/${id}/decline`, {});
  }

  addPayment(id: string, paymentData: any): Observable<any> {
    return this.http.put(`${this.url}/booking/${id}/date-of-payment`, paymentData);
  }

  addPenalty(id: string, paymentData: any): Observable<any> {
    return this.http.put(`${this.url}/booking/${id}/add-penalty`, paymentData);
  }
}






