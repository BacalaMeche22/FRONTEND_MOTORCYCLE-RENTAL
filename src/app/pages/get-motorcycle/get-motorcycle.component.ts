import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MotorService } from '../../services/motor.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-get-motorcycle',
  templateUrl: './get-motorcycle.component.html',
  styleUrls: ['./get-motorcycle.component.css']
})
export class GetMotorcycleComponent implements OnInit, OnChanges {
  @Input() category: string = ''; 

  public motors: any[] = [];
  public filteredMotors: any[] = [];

  constructor(
    private motorService: MotorService,
    private authService: AuthService,
    private router: Router,
    private bookingService:BookingService
  ) {}

  ngOnInit(): void {
    this.loadAllMotors();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category']) {
      this.filterMotorsByCategory();
    }
  }

  loadAllMotors() {
    this.motorService.getAllmotors().subscribe(
      (data) => {
        this.motors = data.motors; 
        this.filterMotorsByCategory(); 
      },
      (error) => {
        console.error('Error fetching motors:', error);
      }
    );
  }

  filterMotorsByCategory() {
    if (this.category) {
      this.filteredMotors = this.motors.filter(
        (motor) => motor.motorCategory.category_name === this.category && motor.isVisible
      );
    } else {
      this.filteredMotors = this.motors.filter((motor) => motor.isVisible);
    }
  }

  toggleBookingPage(motor: any) {
    if (this.authService.isLoggedIn()) {
      Swal.fire({
        title: 'Terms of Agreement',
        html: `
          <div style="font-size: 14px; text-align: left; max-height: 400px; overflow-y: auto; padding-right: 10px;">
            <p>By using our service, you agree to the following terms and conditions:</p>
            <p>Please read them carefully before proceeding:</p>
            <ol style="list-style-position: inside; padding-left: 20px;">
              <li style="margin-bottom: 15px;">1. The RENTER agrees to use the rented motorcycle solely for lawful purposes during the term of this Lease.</li>
              <li style="margin-bottom: 15px;">2. The RENTER shall indemnify and hold the LESSOR harmless from any fines, penalties, or liabilities arising from the violation of any laws or illegal use of the rented motorcycle.</li>
              <li style="margin-bottom: 15px;">3. The RENTER agrees to return the motorcycle within the agreed rental period. Late returns will be charged a Php 50 per hour fee for up to 3 hours. Any delay exceeding 3 hours shall be considered as an additional day.</li>
              <li style="margin-bottom: 15px;">4. All rental payments shall be made directly to the LESSOR or a duly authorized representative.</li>
              <li style="margin-bottom: 15px;">5. The RENTER shall pay the full rental fee upon execution of this agreement. Any extended rental period must be paid upon return of the motorcycle.</li>
              <li style="margin-bottom: 15px;">6. The RENTER shall not sub-lease or permit the motorcycle to be used by any other person or entity.</li>
              <li style="margin-bottom: 15px;">7. The LESSOR agrees to provide one motorcycle for each RENTER, and the motorcycle must be used exclusively by the individual executing this agreement.</li>
              <li style="margin-bottom: 15px;">8. The LESSOR shall provide one free helmet per unit. Additional helmets may be rented for Php 150.00 each. Lost or damaged helmets will incur a Php 1,000.00 penalty.</li>
              <li style="margin-bottom: 15px;">9. The RENTER is responsible for paying for gasoline used during the rental period and must return the motorcycle with the same fuel level as when rented.</li>
              <li style="margin-bottom: 15px;">10. If the motorcycle is damaged, destroyed, or taken by any judicial or governmental authority, the RENTER remains financially responsible for any costs incurred.</li>
              <li style="margin-bottom: 15px;">11. The RENTER must make a deposit of Php 500.00 to Php 1,000.00, depending on the unit, upon execution of this agreement. The deposit will be returned, subject to deductions for damages or penalties.</li>
              <li style="margin-bottom: 15px;">12. A non-refundable reservation fee of Php 500.00 is required for future bookings.</li>
              <li style="margin-bottom: 15px;">13. The RENTER agrees to maintain the motorcycle in good working condition and must wash and clean the unit before returning it. Failure to do so will incur a penalty of Php 50.00.</li>
              <li style="margin-bottom: 15px;">14. If the RENTER cannot return the motorcycle personally and requests retrieval, a fee of Php 300.00 will apply within Cagayan de Oro City. Retrieval fees for locations outside the city will be determined based on distance.</li>
              <li style="margin-bottom: 15px;">15. The RENTER agrees to pay for any extended rental period on the same day through GCash or other money remittance services. Failure to do so within 3 days may result in legal action.</li>
            </ol>
            <p>Do you accept the terms of agreement?</p>
            <label>
            </label>
          </div>
          <div style="text-align: center; margin-top: 15px;">
  <p>Do you accept the terms of agreement?</p>
  <input type="checkbox" id="acceptTerms" style="margin-right: 10px;" />
  <label for="acceptTerms">Yes, I accept.</label>
</div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const acceptTerms = (document.getElementById('acceptTerms') as HTMLInputElement).checked;
          if (!acceptTerms) {
            Swal.showValidationMessage('You must accept the terms and conditions to proceed.');
          }
          return acceptTerms;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.bookingService.setCurrentMotor(motor);
          this.bookingService.showBookingPage();
        }
      });
    } else {
      Swal.fire({
        title: 'You must log in!',
        text: 'Do you want to proceed to login?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Proceed to Login',
        cancelButtonText: 'No, Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
    }
  }
  
  
}
