import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { BookingHistoryService } from '../../services/booking-history.service';
import { UpdateBookingComponent } from '../update-booking/update-booking.component';
import { BookingDetailsComponent } from '../booking-details/booking-details.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-manage-rent',
  templateUrl: './manage-rent.component.html',
  styleUrl: './manage-rent.component.css',
  animations: [
    trigger('slideToggle', [
      state('hidden', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('visible', style({ height: '*', opacity: 1 })),
      transition('hidden <=> visible', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class ManageRentComponent {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  bookingID: any;
  returnForm!: FormGroup;
  selectedBooking: any;

  isDateRangeVisible: boolean = false;
  selectedStatus = '';
  originalData: any[] = [];

  displayedColumns: string[] = [
    'index',
    'renter_name',
    'plate_no',
    'category_name',
    'model_name',
    'start_Date',
    'end_Date',
    'payment_method',
    'total_amount',
    'rental_status',
    'return_status',
    'payment',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  startDate: Date | null = null;
  endDate: Date | null = null;
  minDate: Date = new Date(); 

  constructor(
    private bookinghistory: BookingHistoryService,
    private dialog: MatDialog
  ) {
    this.returnForm = new FormGroup({
      return_status: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadAllBookings();
  }
  allbooking: any[] = [];


  loadAllBookings() {
    this.bookinghistory.getAllBookingHistory().subscribe((res: any[]) => {
      const filteredBookings = res.filter((booking: any) => booking.is_rent === true);
  
      this.allbooking = filteredBookings;
      
      this.originalData = filteredBookings;
  
      this.dataSource.data = filteredBookings;
    });
  }
  

  toggleDateRangeVisibility() {
    this.isDateRangeVisible = !this.isDateRangeVisible;
  }

  applyStatusFilter() {
    if (this.selectedStatus) {
      this.dataSource.data = this.originalData.filter((booking: any) =>
        booking.paid_status === this.selectedStatus || booking.return_status === this.selectedStatus
      );
    } else {
      this.dataSource.data = [...this.originalData];
    }
  }


  getBookingStatus(booking: any) {
    if (booking.booking_status === 'Canceled') return 'Canceled';
    if (booking.is_decline) return 'Declined';
    if (!booking.is_approve) return 'Pending';
    return booking.booking_status;
  }

  getStatusClass(booking: any) {
    if (booking.paid_status === 'PAID') return 'PAID';
    if (booking.paid_status === 'UNPAID') return 'UNPAID';
    if (booking.return_status === 'Returned') return 'Returned';
    if (booking.return_status === 'Not Returned') return 'Not Returned';
    return booking.booking_status && booking.return_status;

  }

  applyDateFilter() {
  
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate).setHours(0, 0, 0, 0); 
      const end = new Date(this.endDate).setHours(23, 59, 59, 999); 
  
  
      const filteredData = this.originalData.filter((booking: any) => {
        const pickupDate = new Date(booking.created_at); 
        
        const isInRange = pickupDate.getTime() >= start && pickupDate.getTime() <= end;
        return isInRange;
      });
  
      this.dataSource.data = filteredData; 
    } else {
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
    this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.applyDateFilter();
  }

  filterYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    this.endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    this.applyDateFilter();
  }

  filterThisMonth() {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.applyDateFilter();
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
    const selectedBooking = this.originalData.find(
      (booking: any) => booking.booking_id === bookingId
    );
  
    if (!selectedBooking) {
      console.warn('Booking not found, opening dialog without specific data');
    }
  
    const dialogRef = this.dialog.open(BookingDetailsComponent, {
      data: selectedBooking || {},
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAllBookings();
      }
    });
  }
  
  

  returnMotor(booking: any) {
    if (!booking || !booking.booking_id) {
      Swal.fire('Error', 'No valid booking is selected for return.', 'error');
      return;
    }
  
    if (booking.paid_status !== 'PAID') {
      Swal.fire('Error', 'The renter has not paid yet. Cannot proceed with return.', 'error');
      return;
    }
  
    this.returnForm.patchValue({ return_status: 'returned' });
  
    this.bookinghistory.updateReturn(booking.booking_id, this.returnForm.value)
      .subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Are you sure the motorcycle has been returned?',
            html: `<div>
                     <p><strong>Motorcycle Name:</strong> ${booking.motor.motorCategory.category_name} ${booking.motor.model} ${booking.motor.cubic_capacity}</p>
                     <p><strong>Plate Number:</strong> ${booking.motor.plate_no}</p>
                   </div>`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire('Saved!', '', 'success');
              this.loadAllBookings(); 
            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info');
            }
          });
        },
        error: (err) => {
          console.error('Error updating booking:', err);
          Swal.fire('Error', 'Failed to update the booking status.', 'error');
        },
      });
  }
  
}
