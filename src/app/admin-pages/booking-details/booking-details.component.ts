import { BookingHistoryService } from './../../services/booking-history.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AddPaymentComponent } from '../add-payment/add-payment.component';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddPenaltyComponent } from '../add-penalty/add-penalty.component';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css'] 
})
export class BookingDetailsComponent implements OnInit {
  bookingId: string = '';
  bookingpayment: any;
  currentDate: string = new Date().toISOString().split('T')[0];

  isSubmitting = false;
  days: number = 0;

  
  constructor(
    private bookingService: BookingHistoryService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<BookingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
  
    if (data) {
      data.selectedHelmet = data.selectedHelmet || false;  // Default to false if not set
      data.selectedStorage = data.selectedStorage || false; // Default to false if not set
    }
  }

  ngOnInit(): void {
    this.bookingId = this.data.booking_id
    this.bookingpayment = this.data.total_amount



  }

  get overallAmount(): number {
    return (this.data.penalty || 0) + (this.data.total_amount || 0);
  }


  calculateDays() {
    const returnDate = new Date(this.data.return_date); 
    const currentDate = new Date(); 
    const diffInMilliseconds = currentDate.getTime() - returnDate.getTime(); 
    this.days = Math.max(0, Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))); 
  }

  openAddPaymentModal() {
    const dialogRef = this.dialog.open(AddPaymentComponent, {
      data: { booking_id: this.bookingId, total_amount: this.bookingpayment }
    });

    dialogRef.afterClosed().subscribe(result => {
     
    });
  }

  openAddPenaltyModal() {
    const dialogRef = this.dialog.open(AddPenaltyComponent, {
      data: { booking_id: this.bookingId, total_amount: this.bookingpayment }
    });

    dialogRef.afterClosed().subscribe(result => {
     
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
