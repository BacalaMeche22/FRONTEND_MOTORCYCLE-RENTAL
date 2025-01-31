import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private paymentPageVisibility = new BehaviorSubject<boolean>(false);
  paymentPageVisible$ = this.paymentPageVisibility.asObservable();

  constructor() { }


   showPaymentPage() {
    this.paymentPageVisibility.next(true);
  }

  hidePaymentPage() {
    this.paymentPageVisibility.next(false);
  }
}
