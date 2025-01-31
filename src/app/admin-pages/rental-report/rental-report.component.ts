import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import { BookingHistoryService } from '../../services/booking-history.service';

@Component({
  selector: 'app-rental-report',
  templateUrl: './rental-report.component.html',
  styleUrls: ['./rental-report.component.css'] 
})
export class RentalReportComponent {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  reportFrom!: string;
  reportTo!: string;
  returnStatusFilter: string = '';  
  filteredData: any[] = [];
  allData: any[] = [];
  users: any[] = [];  // Store list of users
  selectedUser: string = '';  // Selected user for filtering
  isReportGenerated: boolean = false;

  constructor(private bookinghistory: BookingHistoryService) {}

  ngOnInit() {
    this.loadAllBookings();
  }

  loadAllBookings() {
    this.bookinghistory.getAllBookingHistory().subscribe((res: any[]) => {
      this.dataSource.data = res;
      this.allData = res;
  
      // Extract unique users from the booking history for filtering
      this.users = [...new Set(res.map(booking => `${booking.user.first_name} ${booking.user.last_name}`))];
    });
  }

  // Generate report based on selected date range, return status, and user
  generateReport(): void {
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

    // Filter by date range
    this.filteredData = this.allData.filter((booking) => {
      const bookingDate = new Date(booking.created_at);
      return bookingDate >= fromDate && bookingDate <= toDate;
    });

    // Apply return status filter
    this.filterByReturnStatus();

    // Apply user filter if a user is selected
    if (this.selectedUser) {
      this.filterByUser();
    }

    this.isReportGenerated = true;
  }

  // Filter by return status
  filterByReturnStatus() {
    if (this.returnStatusFilter === '') {
      // No return status filter, just filter by date
      this.filteredData = this.allData.filter((booking) => {
        const bookingDate = new Date(booking.created_at);
        const fromDate = new Date(this.reportFrom);
        const toDate = new Date(this.reportTo);
        return bookingDate >= fromDate && bookingDate <= toDate;
      });
    } else {
      // Filter by return status
      this.filteredData = this.filteredData.filter(booking => booking.return_status === this.returnStatusFilter);
    }
  }

  // Filter by selected user (user who rented the motorcycle)
  filterByUser() {
    if (this.selectedUser) {
      this.filteredData = this.filteredData.filter(booking => `${booking.user.first_name} ${booking.user.last_name}` === this.selectedUser);
    }
  }

  // Create the PDF document for the report
  createPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');

    const title = 'Motorcycle Rental';
    const reportTitle = 'Rental Report';
    const dateRange = `Date from: ${new Date(this.reportFrom).toLocaleDateString()} to: ${new Date(this.reportTo).toLocaleDateString()}`;

    doc.setFontSize(14);
    const titleWidth = doc.getStringUnitWidth(title) * 14 / doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
    doc.text(title, titleX, 20);

    doc.setFontSize(10);
    doc.text(reportTitle, 135, 25);
    doc.text(dateRange, 14, 40);

    const headers = [['Created At', 'Renter Name', 'Contact No', 'Plate No.', 'Motorcycle Name', 'Days', 'Pickup Date', 'Return Date', 'Payment Method', 'Paid Status', 'Total Amount', 'Return Status']];

    const rows = this.filteredData.map(booking => [
      new Date(booking.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' +
      new Date(booking.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),

      `${booking.user.first_name} ${booking.user.last_name}`,
      booking.user.contact_no,
      booking.motor.plate_no,
      `${booking.motor.motorCategory.category_name} ${booking.motor.model} ${booking.motor.cubic_capacity}`,
      booking.days,

      new Date(booking.pickup_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' +
      new Date(booking.pickup_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),

      new Date(booking.return_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' +
      new Date(booking.return_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),

      booking.payment_method,
      booking.paid_status,
      booking.total_amount,
      booking.return_status,
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

    return doc;
  }

  // Export the report to PDF
  exportToPDF() {
    const doc = this.createPDF();

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }

  // Print the PDF report
  printPDF() {
    const doc = this.createPDF();

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.src = pdfUrl;
    iframe.onload = () => {
      iframe.contentWindow?.print();
    };
    document.body.appendChild(iframe);
  }
}
