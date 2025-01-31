import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserModel } from '../../interface/UserModel';
import { AuthService } from '../../services/auth.service';
import { BookingHistoryService } from '../../services/booking-history.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-rental-table',
  templateUrl: './rental-table.component.html',
  styleUrl: './rental-table.component.css'
})
export class RentalTableComponent {
  displayedColumns: string[] = [
    'index',
    'model_name',
    'category_name',
    'start_Date',
    'end_Date',
    'total_amount',
    'return_status',
    'payment',
    'actions',
  ];
  userInfo: UserModel | null = null;
  dataSource: MatTableDataSource<any>;
  allbooking: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

 
  constructor(private bookingService: BookingService,private bookinghistory: BookingHistoryService,private auth: AuthService) {
    this.dataSource = new MatTableDataSource();
    this.loadAllBookings();
    this.userInfo = this.auth.getUserInfo();
  }

  loadAllBookings() {
    this.bookinghistory.getAllBookingHistory().subscribe((res) => {
      this.allbooking = res.filter(
        (booking: any) =>
          booking.user.user_id === this.userInfo?.user_id &&
          booking.is_rent === true
      );
  
  
      this.dataSource.data = this.allbooking;
    });
  }
  
  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewBooking(booking: any) {
    this.bookinghistory.setBookingData(booking);
  
    this.bookingService.hidePaymentPage(); 
    this.bookingService.hideBookingPage(); 
    this.bookingService.hideViewBookingPage(); 
    this.bookingService.hideBookingHistoryPage(); 
    this.bookingService.hideConfirmPage();
    this.bookingService.hideBookingHistoryPage();
    this.bookingService.hideBookingApprovedPage();
  
    if (booking.booking_status === 'pending' || booking.booking_status === 'Cancel') {
      this.bookingService.showViewBookingPage();
      this.bookingService.hideViewRentalPage();
    } else if (booking.booking_status === 'Approved') {
      this.bookingService.showBookingApprovedPage();
      this.bookingService.hideViewRentalPage();

    } else {
      console.warn('Unexpected booking status:', booking.booking_status);
    }
  }
  
}
