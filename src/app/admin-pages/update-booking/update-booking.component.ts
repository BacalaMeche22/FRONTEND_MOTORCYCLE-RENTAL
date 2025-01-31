import { Component, Inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookingHistoryService } from '../../services/booking-history.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertServiceService } from '../../services/alert-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-booking',
  templateUrl: './update-booking.component.html',
  styleUrls: ['./update-booking.component.css']
})
export class UpdateBookingComponent implements OnInit {
  bookingInfo: any;
  selectedBooking: any;
  bookingForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private booking: BookingHistoryService,
    private fb: FormBuilder,
    private alertService: AlertServiceService,

  ) {}

  existingBookingData = {
    pickup_date: '',
    return_date: '',
    days: 0,
    total_amount: 0,
    reference_link: '',
    booking_status: '',
    remark: '',
    paid_status: '',
    return_status: '',
    free_helmet: '',
    second_helmet: '',
    phone_holder: '',
    extra_storage: '',
    payment_method: '',
    motor_id: '',
    user_id: ''
  };

  ngOnInit(): void {
    this.loadSelectedBooking();
    this.bookingForm = this.fb.group({
      booking_status: [this.existingBookingData.booking_status || ''], 
      return_status: [this.existingBookingData.return_status],
      paid_status: [this.existingBookingData.paid_status],
      remark: [this.existingBookingData.remark],
    });
  }

  loadSelectedBooking() {
    this.bookingInfo = this.data.booking_id;

    this.booking.GetBookingbyid(this.bookingInfo).subscribe((res) => {
      this.selectedBooking = res;
      

      this.existingBookingData = {
        pickup_date: this.selectedBooking.pickup_date,
        return_date: this.selectedBooking.return_date,
        days: this.selectedBooking.days,
        total_amount: this.selectedBooking.total_amount,
        reference_link: this.selectedBooking.reference_link,
        booking_status: this.selectedBooking.booking_status,
        remark: this.selectedBooking.remark,
        paid_status: this.selectedBooking.paid_status,
        return_status: this.selectedBooking.return_status,
        free_helmet: this.selectedBooking.free_helmet,
        second_helmet: this.selectedBooking.second_helmet,
        phone_holder: this.selectedBooking.phone_holder,
        extra_storage: this.selectedBooking.extra_storage,
        payment_method: this.selectedBooking.payment_method,
        motor_id: this.selectedBooking.motor?.motor_id,
        user_id: this.selectedBooking.user?.user_id,
      };

      this.bookingForm = this.fb.group({
        booking_status: [this.existingBookingData.booking_status],
        return_status: [this.existingBookingData.return_status],
        paid_status: [this.existingBookingData.paid_status],
        remark: [this.existingBookingData.remark],
      });

      

    });
  }
  isLoadingButton = signal<boolean>(false);


  approvedButton() {
    this.isLoadingButton.set(true);
    if (!this.selectedBooking?.booking_id) {
      this.selectedBooking.fire('Error', 'Booking ID is missing.', 'error');
      this.isLoadingButton.set(false);
      return;
    }
    this.booking.approveBooking(this.selectedBooking.booking_id).subscribe(
      () => {
        Swal.fire({
          title: "Are you sure you want to approve?",
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "Yes",
          denyButtonText: `No`
        }).then((result) => {
          
          this.isLoadingButton.set(false);
          if (result.isConfirmed) {
            Swal.fire("Saved!", "", "success");
            window.location.reload()
          } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
            this.isLoadingButton.set(false);
          }
        });
      },
      (error) => {
        console.error(`Error approving booking with ID ${this.selectedBooking.booking_id}:`, error);
        Swal.fire('Error', 'There was a problem approving the booking.', 'error');
      }
    );
  }


  declinedButton() {
    this.isLoadingButton.set(true);
    if (!this.selectedBooking?.booking_id) {
      this.selectedBooking.fire('Error', 'Booking ID is missing.', 'error');
      this.isLoadingButton.set(false);
      return;
    }
    this.booking.declined(this.selectedBooking.booking_id).subscribe(
      () => {
        Swal.fire({
          title: "Are you sure you want to approve?",
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "Yes",
          denyButtonText: `No`
        }).then((result) => {
          this.isLoadingButton.set(false);
          if (result.isConfirmed) {
            Swal.fire("Saved!", "", "success");
            window.location.reload()
          } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
            this.isLoadingButton.set(false);
          }
        });
      },
      (error) => {
        console.error(`Error approving booking with ID ${this.selectedBooking.booking_id}:`, error);
        Swal.fire('Error', 'There was a problem approving the booking.', 'error');
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
  
