import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MotorService } from '../../services/motor.service';
import { LocationComponent } from '../location/location.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BookingHistoryService } from '../../services/booking-history.service';
import { UpdateBookingComponent } from '../update-booking/update-booking.component';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css'
})
export class TrackingComponent implements AfterViewInit, OnInit{
  
  displayedColumns: string[] = [ 'index', 'motor_model', 'booking_date', 'booking_status','return_status', 'actions' ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  bookingID: any;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookinghistory: BookingHistoryService,private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllBookings();
  }

  loadAllBookings() {
    this.bookinghistory.getAllBookingHistory().subscribe((res: any[]) => {
      this.bookingID = res
      this.dataSource.data = res;
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

  openAddBookingDialog(bookingId: string) {
    const selectedBooking = this.bookingID.find((booking:any) =>booking.booking_id === bookingId);

    if (selectedBooking) {
      const dialogRef = this.dialog.open(LocationComponent, {
        width: 'auto', 
        height: 'auto',
        panelClass: 'custom-dialog',
        data: selectedBooking
        
        
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadAllBookings();
        }
      });
    }
 
  }
}
