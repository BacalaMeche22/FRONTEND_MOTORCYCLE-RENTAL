import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-rental-receipt',
  templateUrl: './rental-receipt.component.html',
  styleUrls: ['./rental-receipt.component.css'],
  providers: [DatePipe] 
})
export class RentalReceiptComponent {
  constructor(
    public dialogRef: MatDialogRef<RentalReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe 
  ) {
    console.log('Booking ID:', this.data.booking_id);
    console.log('Booking Details:', this.data.bookingDetails);
  }

  ngOnInit() {
    console.log('Dialog Data:', this.data);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMMM d, y') || date;
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  printReceipt() {
    window.print(); 
  }

  viewPDF() {
    const doc = new jsPDF() as jsPDF & { lastAutoTable: { finalY: number } };
    const { bookingDetails } = this.data;

    doc.setFont('times', 'normal');

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    const title = 'Rental Receipt';
    const textWidth = doc.getTextWidth(title);
    const xPos = (pageWidth - textWidth) / 2; 
    doc.text(title, xPos, 20);

    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text('Booking Details:', 14, 30);

    doc.setFont('times', 'normal');

    const details = [
      ['Booking ID:', bookingDetails.booking_id],
      ['Motorcycle:', `${bookingDetails.motor?.model} - ${bookingDetails.motor?.color}`],
      ['Plate Number:', bookingDetails.motor?.plate_no],
      ['Renter Name:', `${bookingDetails.user?.first_name} ${bookingDetails.user?.last_name}`],
      ['Contact No.:', bookingDetails.user?.contact_no || 'N/A'],
      ['Email:', bookingDetails.user?.email],
      ['Address:', bookingDetails.user?.address || 'N/A'],
      ['Booking Request:', this.formatDate(bookingDetails.created_at)], 
      ['Start Date:', this.formatDate(bookingDetails.pickup_date)],     
      ['End Date:', this.formatDate(bookingDetails.return_date)],       
      ['Payment Option:', bookingDetails.payment_method],
      ['Payment Status:', bookingDetails.paid_status],
    ];

    (doc as any).autoTable({
      startY: 35,
      body: details,
      styles: {
        font: 'times', 
        fontSize: 12,  
      }
    });

    doc.setFont('times', 'bold');
    doc.text('Rental Summary:', 14, (doc as any).lastAutoTable.finalY + 10);

    doc.setFont('times', 'normal');

    const summary = [
      ['Days:', bookingDetails.days],
      ['Motorcycle Rent Price:', this.formatPrice(bookingDetails.motor?.price)], 
   //   ['Additional Helmet:', this.formatPrice(bookingDetails.motor?.helmet_price || 0)], 
      ['Free Helmet:', bookingDetails.free_helmet ? 'FREE' : ''],
      ['Phone Holder:', bookingDetails.phone_holder ? 'FREE' : ''],      
    //  ['Extra Storage:', this.formatPrice(bookingDetails.motor?.storage_price || 0)], 
      ['Total Amount:', `Php ${this.formatPrice(bookingDetails.total_amount)}`], 
    ];

    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 15,
      body: summary.map(([key, value]) => {
        if (key === 'Total Amount:') {
          return [
            { content: key, styles: { fontStyle: 'bold', font: 'times' } }, 
            { content: value, styles: { fontStyle: 'bold', font: 'times' } }
          ];
        }
        return [
          { content: key, styles: { font: 'times' } }, 
          { content: value, styles: { font: 'times' } }
        ];
      }),
      styles: {
        font: 'times', 
        fontSize: 12,  
      }
    });

    window.open(doc.output('bloburl'), '_blank');
  }
}
