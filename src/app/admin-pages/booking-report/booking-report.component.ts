import { Component, OnInit } from '@angular/core';
import { BookingHistoryService } from '../../services/booking-history.service';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.css'],
})
export class BookingReportComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  reportFrom!: string;
  reportTo!: string;
  filteredData: any[] = [];
  isReportGenerated: boolean = false;

  bookingStatusFilter: string = '';
  selectedUser: string = ''; // For user filtering

  users: any[] = []; // Stores the list of users from the booking history service

  constructor(private bookinghistory: BookingHistoryService) {}

  ngOnInit() {
    this.loadAllBookings();
  }

  loadAllBookings() {
    // Fetch all booking history and the unique users from the service
    this.bookinghistory.getAllBookingHistory().subscribe((res: any[]) => {
      this.dataSource.data = res;
      // Fetch unique users based on the booking history
      this.users = this.getUniqueUsers(res);
    });
  }

  // Function to extract unique users
  getUniqueUsers(bookings: any[]): any[] {
    const usersSet = new Set(bookings.map(booking => `${booking.user.first_name} ${booking.user.last_name}`));
    return Array.from(usersSet);
  }

  generateReport() {
    if (!this.reportFrom || !this.reportTo) {
      alert('Please select both start and end dates.');
      return;
    }

    const fromDate = new Date(this.reportFrom);
    const toDate = new Date(this.reportTo);

    if (fromDate > toDate) {
      alert('Start date cannot be after end date.');
      return;
    }

    this.filteredData = this.dataSource.data.filter((booking) => {
      const bookingDate = new Date(booking.created_at);
      return bookingDate >= fromDate && bookingDate <= toDate;
    });

    this.applyFilters();
    this.isReportGenerated = true;
  }

  applyFilters() {
    this.filteredData = this.filteredData.filter(booking => {
      const matchesBookingStatus = this.bookingStatusFilter === '' || booking.booking_status === this.bookingStatusFilter;
      const matchesUser = this.selectedUser === '' || `${booking.user.first_name} ${booking.user.last_name}` === this.selectedUser;
      return matchesBookingStatus && matchesUser;
    });
  }

  filterByBookingStatus() {
    if (this.isReportGenerated) {
      this.applyFilters();
    }
  }

  exportToPDF(viewOnly: boolean = false) {
    const doc = new jsPDF('l', 'mm', 'a4');
    const title = 'Motorcycle Rental';
    const reportTitle = 'Booking Report';
    const dateRange = `Date from: ${new Date(this.reportFrom).toLocaleDateString()} to: ${new Date(this.reportTo).toLocaleDateString()}`;

    doc.setFontSize(14);
    const titleWidth = doc.getStringUnitWidth(title) * 14 / doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
    doc.text(title, titleX, 20);

    doc.setFontSize(10);
    doc.text(reportTitle, 135, 25);
    doc.text(dateRange, 14, 40);

    const headers = [
      ['Created At', 'Booking ID', 'Renter Name', 'Plate No.', 'Motorcycle Name', 'Days', 'Pickup Date', 'Return Date', 'Booking Status']
    ];

    const rows = this.filteredData.map(booking => [
      new Date(booking.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' +
      new Date(booking.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),

      booking.booking_id,
      `${booking.user.first_name} ${booking.user.last_name}`,
      booking.motor.plate_no,
      `${booking.motor.motorCategory.category_name} ${booking.motor.model} ${booking.motor.cubic_capacity}`,
      booking.days,

      new Date(booking.pickup_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' +
      new Date(booking.pickup_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),

      new Date(booking.return_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' +
      new Date(booking.return_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),

      booking.booking_status
    ]);

    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: 50,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });

    const signatureStartY = (doc as any).lastAutoTable.finalY + 20;
    doc.text('_____________________', 20, signatureStartY + 4);
    doc.text('Signatories 1', 30, signatureStartY + 10);

    if (viewOnly) {
      const pdfBlob = doc.output('blob');
      const pdfURL = URL.createObjectURL(pdfBlob);
      window.open(pdfURL, '_blank');
    } else {
      const pdfBlob = doc.output('blob');
      const pdfURL = URL.createObjectURL(pdfBlob);
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.src = pdfURL;
      iframe.onload = () => iframe.contentWindow?.print();
      document.body.appendChild(iframe);
    }
  }
}
