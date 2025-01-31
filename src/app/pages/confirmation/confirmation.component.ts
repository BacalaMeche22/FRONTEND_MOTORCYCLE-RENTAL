import { Component, Input, OnInit } from '@angular/core';
import { BookingHistoryService } from './../../services/booking-history.service';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  bookingDetails: any; 
  bookingId:any

  constructor(
    private bookingHistoryService: BookingHistoryService,
    private route: ActivatedRoute,
    private bookingService: BookingService,

  ) {}

  ngOnInit(): void {
    this.bookingService.bookingId$.subscribe((id) => {
      this.bookingId = id;
    });
    this.loadAllData()
    this.populateBookingDetails();
  }

  loadAllData(){
    this.bookingHistoryService.GetBookingbyid(this.bookingId).subscribe((res) => {
      this.bookingDetails = res

      console.log( this.bookingDetails, 'booking details');
      
   
    });
  }

  bookingSummary: any;
  populateBookingDetails() {
    this.bookingSummary = this.bookingService.getBookingSummary();

   

  }

  toggleViewBookingPage() {
    this.bookingService.hideBookingPage();
    this.bookingService.hidePaymentPage();
    this.bookingService.hideConfirmPage();
    this.bookingService.hideCancelBookingPage();
    this.bookingService.hideBookingApprovedPage();
    this.bookingService.hideBookingHistoryPage();
    this.bookingService.hideViewRentalPage(); 
  
    this.bookingService.showBookingHistoryPage();
  }
  
  generateAndViewPDF() {
    const doc = new jsPDF();
    doc.setFont("Arial", "normal");

    doc.setFontSize(14);
    doc.text('Booking Invoice', 105, 15, { align: 'center' });
    doc.line(20, 20, 190, 20); 
  
    let y = 25; 

    
    doc.setFontSize(10);
    doc.text(`Booking ID: ${this.bookingDetails?.booking_id}`, 20, y);
    doc.text(`Motorcycle: ${this.bookingDetails?.motor?.motorCategory?.category_name} ${this.bookingDetails?.motor?.model} ${this.bookingDetails?.motor?.cubic_capacity}`, 20, (y += 5));
    doc.text(`Plate Number: ${this.bookingDetails?.motor?.plate_no}`, 20, (y += 5));
    doc.text(`Renter: ${this.bookingDetails?.user?.first_name} ${this.bookingDetails?.user?.last_name}`, 20, (y += 5));
    doc.text(`Contact: ${this.bookingDetails?.user?.contact_no}`, 20, (y += 5));
    doc.text(`Email: ${this.bookingDetails?.user?.email}`, 20, (y += 5));
    doc.text(`Address: ${this.bookingDetails?.user?.address}`, 20, (y += 5));

    y = 25;
    doc.text(`Booking Request: ${new Date(this.bookingDetails?.created_at).toLocaleString()}`, 110, y);
    doc.text(`Start Date: ${new Date(this.bookingDetails?.pickup_date).toLocaleDateString()}`, 110, (y += 5));
    doc.text(`End Date: ${new Date(this.bookingDetails?.return_date).toLocaleDateString()}`, 110, (y += 5));
    doc.text(`Payment Method: ${this.bookingDetails?.payment_method}`, 110, (y += 5));
    doc.text(`Payment Status: ${this.bookingDetails?.paid_status}`, 110, (y += 5));
    doc.setTextColor(0, 0, 0); 
  
    y += 20; 
    doc.setFontSize(12);
    doc.text('Total Booking Summary:', 20, y);
    doc.setFontSize(10);
    doc.text(`Pick-up Date: ${new Date(this.bookingSummary?.pickupDate).toLocaleDateString()}`, 20, (y += 5));
    doc.text(`Return Date: ${new Date(this.bookingSummary?.returnDate).toLocaleDateString()}`, 20, (y += 5));
    doc.text(`Days: ${this.bookingSummary?.days} day(s)`, 20, (y += 5));
    doc.text(`Motor Price: Php ${this.bookingSummary?.motorPrice}`, 20, (y += 5));
    doc.text(`Helmet: Free`, 20, (y += 5));
    doc.text(`Phone Holder: Free`, 20, (y += 5));
    doc.text(`Addtional Helmet: Php ${this.bookingSummary?.helmet || '0'}`, 20, (y += 5));
    doc.text(`Extra Storage: Php ${this.bookingSummary?.extraStorage}`, 20, (y += 5));
   
  
  
    doc.line(20, y + 5, 190, y + 5); 
    doc.setFontSize(11);
    doc.text('Total Amount:', 20, (y += 10));
    doc.setFontSize(14);
    doc.text(`Php ${this.bookingSummary?.total}`, 180, y, { align: 'right' });
  
    doc.setFontSize(8);
    doc.text(`Printed On: ${new Date().toLocaleString()}`, 20, 290);
  
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }
  
  

}