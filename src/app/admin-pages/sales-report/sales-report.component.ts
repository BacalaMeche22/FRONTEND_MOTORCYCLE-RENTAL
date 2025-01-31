import { Component, OnInit } from '@angular/core';
import { BookingHistoryService } from '../../services/booking-history.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css'],
})
export class SalesReportComponent implements OnInit {
  reportFrom!: string;
  reportTo!: string;
  dataSource: any[] = [];
  filteredData: any[] = [];
  isReportGenerated: boolean = false;

  constructor(private bookinghistoryService: BookingHistoryService) {}

  ngOnInit() {
    this.loadAllBookings();
  }

  loadAllBookings() {
    this.bookinghistoryService.getAllBookingHistory().subscribe((res: any[]) => {
      this.dataSource = res;
      console.log(this.dataSource, 'data');
    });
  }

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

    this.filteredData = this.dataSource
      .filter((booking) => {
        const bookingDate = new Date(booking.pickup_date);
        return bookingDate >= fromDate && bookingDate <= toDate;
      })
      .map((booking) => {
        const totalWithPenalty = booking.total_amount + (booking.penalty || 0); 
        return {
          ...booking,
          total_amount_with_penalty: totalWithPenalty, 
          formattedPickupDate: new Date(booking.pickup_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          formattedReturnDate: new Date(booking.return_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        };
      });

    this.isReportGenerated = true;
  }

  calculateTotalSales(): number {
    return this.filteredData.reduce(
      (total, booking) => total + booking.total_amount_with_penalty, 
      0
    );
  }

  formatCurrency(value: number): string {
    return '' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
  }

  createPDF(): jsPDF {
    const doc = new jsPDF('landscape', 'mm', 'a4');

    doc.setFontSize(14);
    doc.text('Sales Report', 135, 20);
    doc.setFontSize(10);
    doc.text(`From: ${this.reportFrom} To: ${this.reportTo}`, 135, 30);

    const headers = [['#', 'Plate No', 'Motorcycle Name', 'Penalty', 'Rent Date', 'Return Date', 'Total Amount']];
    const rows = this.filteredData.map((booking, index) => [
      index + 1,
      booking.motor.plate_no,
      `${booking.motor.motorCategory.category_name} ${booking.motor.model} ${booking.motor.cubic_capacity}`,
      this.formatCurrency(booking.penalty || 0), 
      booking.formattedPickupDate,
      booking.formattedReturnDate,
      this.formatCurrency(booking.total_amount_with_penalty),
    ]);

    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: 40,
      theme: 'striped',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const totalSales = this.calculateTotalSales().toFixed(2);
    const totalSalesText = `Total Sales: ${this.formatCurrency(Number(totalSales))}`;
    const textWidth = doc.getTextWidth(totalSalesText);

    doc.text(totalSalesText, pageWidth - textWidth - 10, (doc as any).lastAutoTable.finalY + 10);
    return doc;
  }

  exportToPDF() {
    const doc = this.createPDF();
    doc.output('dataurlnewwindow');
  }

  printPDF() {
    const doc = this.createPDF();
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.src = pdfUrl;

    iframe.onload = () => iframe.contentWindow?.print();
    document.body.appendChild(iframe);
  }
}
