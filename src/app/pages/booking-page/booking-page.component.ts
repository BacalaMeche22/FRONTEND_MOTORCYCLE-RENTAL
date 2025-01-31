import { BookingHistoryService } from './../../services/booking-history.service';
import { Component, Input } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent {
  public pickupDate: Date | null = null;
  public returnDate: Date | null = null;
  minDate: Date = new Date();  
  maxDate: Date = new Date(); 

  isExtraHelmetSelected = false;
  isCpHolderSelected = true;
  isExtraStorageSelected = false;

  pickupTime: string | null = null;
  rentalDays: number = 0;
  returnTime: string = '20:30 PM';
  disabledDates: Set<string> = new Set();
  helmetPrice:number = 0
  storagePrice:number = 0

  @Input() selectedMotor: any = null;
  selectedmotorId: any
  constructor(private bookingService: BookingService, private router: Router, private allbooking: BookingHistoryService) {
    this.selectedMotor = this.bookingService.getCurrentMotor();
    this.helmetPrice =   this.selectedMotor.helmet_price
    this.storagePrice = this.selectedMotor.storage_price
    this.setMinDate();
  }
  

  ngOnInit(): void {
    const today = new Date();
    this.setMinDate();

    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1); 
    this.maxDate = maxDate;
    this.selectedmotorId = this.selectedMotor.motor_id;

    this.loadAllBookings();

    this.calculateTotalPrice();
  }


  calculateTotalPrice() {
    let basePrice = this.selectedMotor.price * this.rentalDays;
    let helmetPrice = this.isExtraHelmetSelected ? this.selectedMotor.helmet_price * this.rentalDays : 0;
    let storagePrice = this.isExtraStorageSelected ? this.selectedMotor.storage_price * this.rentalDays : 0;
  
    this.totalPrice = basePrice + helmetPrice + storagePrice;
  }
  
  mounted() {
    this.calculateTotalPrice();
  }

  onInputChange(field: string, value: any): void {
    if (field === 'pickupDate' && value) {
      const date = new Date(value); 
      
      if (this.pickupTime) {
        const [hours, minutes] = this.pickupTime.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
      } else {
        date.setHours(0, 0, 0, 0);
      }
  
      this.pickupDate = date;
    }
  
    if (field === 'pickupTime' && value) {
      this.pickupTime = value;
      
      if (this.pickupDate) {
        const [hours, minutes] = this.pickupTime!.split(':').map(Number);
        this.pickupDate.setHours(hours, minutes, 0, 0); 
      }
    }

    
  }

 
  
  calculateReturnDate(): void {
    if (this.pickupDate && this.rentalDays) {
      const returnDate = new Date(this.pickupDate);
      returnDate.setDate(returnDate.getDate() + this.rentalDays); 
      this.returnDate = returnDate;
    }
  }

  formatDate(date: Date | null): string {
    if (date) {
      return date.toLocaleDateString(); 
    }
    return '';
  }

  


  setMinDate() {
    const currentDate = new Date();
    this.minDate = currentDate;  
  }

  loadallbooking: any[] = []

  loadAllBookings() {
    this.allbooking.getAllBookingHistory().subscribe(
      (res: any[]) => {
        this.loadallbooking = res;
        
        this.loadallbooking.forEach(booking => {
        });

        this.loadallbooking.forEach(booking => {
          if (booking.motor.motor_id === this.selectedmotorId) {
          }
        });

        this.calculateDisabledDates();
      },
      error => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  calculateDisabledDates() {
    this.disabledDates.clear();

    this.loadallbooking.forEach(booking => {
      if (booking.motor.motor_id === this.selectedmotorId) {

        const startDate = new Date(booking.pickup_date);
        const endDate = new Date(booking.return_date);
        let currentDate = startDate;

        while (currentDate <= endDate) {
          const formattedDate = currentDate.toISOString().split('T')[0];
          this.disabledDates.add(formattedDate);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });

  }


  myDateFilter = (date: Date | null): boolean => {
    if (!date) return true;
    const dateString = date.toISOString().split('T')[0];
    return !this.disabledDates.has(dateString);
  };
  
  
  dateClass = (date: Date): string => {
    const dateString = date.toISOString().split('T')[0];
    return this.disabledDates.has(dateString) ? 'disabled-date' : '';  
  };
  

  availableTimes: string[] = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', 
    '04:00 PM', '05:00 PM'
  ];

  

  isDateDisabled(date: Date | null): boolean {
    if (!date) return false;  
    const dateString = date.toISOString().split('T')[0];
    return this.disabledDates.has(dateString);  
  }
  

  dateFilter = (date: Date | null): boolean => {
    if (!date) return true;
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return !this.disabledDates.has(formattedDate);
  };


  isValidDate(date: string): boolean {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }

  isValidTime(time: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  }





  onPickupTimeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pickupTime = input.value;
  }

  onReturnTimeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.returnTime = input.value;
  }

  includeHelmet = false;
  includeStorage = false;

  totalPrice: number = 0;
  
 



  updateTotalPrice(): void {
    const basePrice = this.selectedMotor.price * this.rentalDays;
    const extraHelmetCost = this.isExtraHelmetSelected ? this.selectedMotor.helmet_price * this.rentalDays : 0;
    const extraStorageCost = this.isExtraStorageSelected ? this.selectedMotor.storage_price * this.rentalDays : 0;
  
    this.totalPrice = basePrice + extraHelmetCost + extraStorageCost;
  }
  togglePaymentPage() {
    if (!this.pickupDate || !this.returnDate || !this.pickupTime || !this.returnTime) {
      Swal.fire({
        title: 'Incomplete Information',
        text: 'Please select both pickup and return dates and times before proceeding.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
  
    Swal.fire({
      title: 'Proceed to Payment?',
      text: 'Are you sure you want to proceed to the payment method?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.isExtraHelmetSelected) {
          this.totalPrice = this.selectedMotor.price * this.rentalDays;
        } else {
          this.totalPrice = 
            (this.selectedMotor.price * this.rentalDays) + 
            (this.isExtraHelmetSelected ? this.selectedMotor.helmet_price * this.rentalDays : 0) +
            (this.isExtraStorageSelected ? this.selectedMotor.storage_price * this.rentalDays : 0);
        }
  
        const bookingSummary = {
          days: this.rentalDays,
          pickupDate: this.pickupDate,
          pickupTime: this.pickupTime,
          returnDate: this.returnDate,
          returnTime: this.returnTime,
          motorPrice: this.selectedMotor.price * this.rentalDays,
          helmet: this.isExtraHelmetSelected ? this.selectedMotor.helmet_price * this.rentalDays : 0,
          phoneHolder: this.isCpHolderSelected ? 0 : 0,
          extraStorage: this.isExtraStorageSelected ? this.selectedMotor.storage_price * this.rentalDays : 0,
          total: this.totalPrice,
          helmetFree: !this.isExtraHelmetSelected,
        };
  
        this.bookingService.setBookingSummary(bookingSummary);
  
        this.bookingService.hideBookingPage();
        this.bookingService.showPaymentPage();
        this.bookingService.hideConfirmPage();
      }
    });
  }
  


  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }


  close(): void {
    this.router.navigate(['/']);
    window.location.reload();
  }

  updateRentalDuration() {
    if (this.pickupDate && this.returnDate && this.pickupTime && this.returnTime) {
    }
  }

  preventInteraction(event: Event): void {
    event.preventDefault();
  }

}
