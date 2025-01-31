import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { BookingHistoryService } from '../../services/booking-history.service';
import { UpdateBookingComponent } from '../update-booking/update-booking.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  animations: [
    trigger('slideToggle', [
      state('hidden', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('visible', style({ height: '*', opacity: 1 })),
      transition('hidden <=> visible', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class BookingComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  isDateRangeVisible: boolean = false;
  selectedStatus: string = '';
  originalData: any[] = [];
  displayedColumns: string[] = [
    'index',
    'renter_name',
    'plate_no',
    'category_name',
    'model_name',
    'start_Date',
    'end_Date',
    'Status',
    'actions',
  ];
  startDate: Date | null = null;
  endDate: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookingHistoryService: BookingHistoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllBookings();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAllBookings() {
    this.bookingHistoryService.getAllBookingHistory().subscribe({
      next: (res: any[]) => {
        this.originalData = res;
        this.dataSource.data = [...this.originalData];
      },
      error: (err) => console.error('Failed to load bookings:', err),
    });
  }

  toggleDateRangeVisibility() {
    this.isDateRangeVisible = !this.isDateRangeVisible;
  }

  applyStatusFilter() {
    if (this.selectedStatus) {
      this.dataSource.data = this.originalData.filter((booking) =>
        this.getBookingStatus(booking) === this.selectedStatus
      );
    } else {
      this.dataSource.data = [...this.originalData];
    }
  }

  getBookingStatus(booking: any): string {
    if (booking.is_approve) {
      return 'Approved';
    }
    if (booking.is_decline) {
      return 'Declined'; 
    }
    if (booking.booking_status === 'Canceled') {
      return 'Canceled';
    }
    return booking.booking_status || 'Pending';
  }
  

  getStatusClass(booking: any): string {
    switch (this.getBookingStatus(booking)) {
      case 'Canceled':
        return 'text-light-red font-bold';
      case 'Approved':
        return 'text-green font-bold';  // Class for approved status
      case 'Pending':
        return 'text-blue font-bold';
      case 'Declined':
        return 'text-red font-bold';
      default:
        return '';
    }
  }

  applyDateFilter() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate).setHours(0, 0, 0, 0);
      const end = new Date(this.endDate).setHours(23, 59, 59, 999);
      this.dataSource.data = this.originalData.filter((booking: any) => {
        const pickupDate = new Date(booking.pickup_date);
        return pickupDate.getTime() >= start && pickupDate.getTime() <= end;
      });
    } else {
      console.warn('Start date or end date is missing');
    }
  }

  resetFilters() {
    this.dataSource.data = [...this.originalData];
    this.startDate = null;
    this.endDate = null;
  }

  filterToday() {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.endDate = this.startDate;
    this.applyDateFilter();
  }

  filterYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    this.endDate = this.startDate;
    this.applyDateFilter();
  }

  filterThisMonth() {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.applyDateFilter();
  }

  openAddBookingDialog(bookingId: string) {
    const selectedBooking = this.dataSource.data.find((booking: any) => booking.booking_id === bookingId);
    if (selectedBooking) {
      const dialogRef = this.dialog.open(UpdateBookingComponent, {
        panelClass: 'custom-dialog',
        data: selectedBooking,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadAllBookings();
        }
      });
    }
  }
}
