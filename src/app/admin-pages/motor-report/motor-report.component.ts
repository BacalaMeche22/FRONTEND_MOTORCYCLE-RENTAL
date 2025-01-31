import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BookingHistoryService } from '../../services/booking-history.service';

@Component({
  selector: 'app-motor-report',
  templateUrl: './motor-report.component.html',
  styleUrls: ['./motor-report.component.css'],
})
export class MotorReportComponent {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  categories: any[] = [];
  selectedCategory: string | null = null;
  isDropdownOpen = false;
  originalData: any[] = []; 

  constructor(private bookinghistory: BookingHistoryService) {}

  ngOnInit() {
    this.loadAllBookings();
  }

  
  loadAllBookings() {
    this.bookinghistory.getAllBookingHistory().subscribe((res: any[]) => {
      console.log(res, 'all data');

      this.originalData = res; 
      this.dataSource.data = res.map((booking) => ({
        ...booking,
        formattedCreatedAt: new Date(booking.created_at).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        }),
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
        motorcycleFullName: `${booking.motor.motorCategory.category_name} ${booking.motor.model} ${booking.motor.cubic_capacity}` 
      }));

     
      const allCategories = res.map(
        (booking) => booking.motor.motorCategory.category_name + ' ' + booking.motor.model+ ' ' + booking.motor.cubic_capacity
      );
      this.categories = Array.from(new Set(allCategories)); 
    });
  }

 
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  
  filterByCategory(category: string) {
    this.selectedCategory = category;
  
  
    this.dataSource.data = this.originalData.filter(
      (booking) => `${booking.motor.motorCategory.category_name} ${booking.motor.model} ${booking.motor.cubic_capacity}` === category
    );
  }
  
 
  resetFilter() {
    this.selectedCategory = null;
    this.isDropdownOpen = false;
    this.dataSource.data = [...this.originalData]; 
  }

 
  exportToPDF(viewOnly: boolean = false) {
    const doc = new jsPDF('l', 'mm', 'a4');

    const title = 'Motorcycle Rental';
    doc.setFontSize(14);
    const titleWidth = doc.getStringUnitWidth(title) * 14 / doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
    doc.text(title, titleX, 20);

    doc.setFontSize(10);
    const headers = [['Created At', 'Renter Name', 'Days', 'Pickup Date', 'Return Date', 'Status']];
    const rows = this.dataSource.data.map((booking) => [
      booking.formattedCreatedAt,
      `${booking.user.first_name} ${booking.user.last_name}`,
      booking.days,
      booking.formattedPickupDate,
      booking.formattedReturnDate,
      booking.rental_status,
    ]);

    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: 50,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });

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
