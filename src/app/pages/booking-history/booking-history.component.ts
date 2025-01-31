import { Component, AfterViewInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { BookingHistoryService } from "../../services/booking-history.service";
import { UserModel } from "../../interface/UserModel";
import { AuthService } from "../../services/auth.service";
import { BookingService } from "../../services/booking.service";

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.css'
})
export class BookingHistoryComponent implements AfterViewInit {
  displayedColumns: string[] = [ 'index','category_name','motor_model','plate_no','start_date','end_date', 'booking_date', 'booking_status', 'actions'];

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
          booking.user.user_id === this.userInfo?.user_id && booking.is_rent !== true
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
    this.bookingService.hideConfirmPage();
    this.bookingService.hideBookingHistoryPage();
    this.bookingService.hideBookingApprovedPage();
    this.bookingService.hideViewRentalPage();
  
    if (booking.booking_status === 'Pending' || booking.booking_status === 'Cancel') {
      this.bookingService.showViewBookingPage();
    } else if (booking.booking_status === 'Approved') {
      this.bookingService.showBookingApprovedPage();
    } else {
      console.warn('Unexpected booking status:', booking.booking_status);
    }
  }
  
}
