import { ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { UserModel } from '../../interface/UserModel';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import { BookingHistoryService } from '../../services/booking-history.service';
import { MotorService } from '../../services/motor.service';
import { CategoriesService } from '../../services/categories.service';
import { BlocklistService } from '../../services/blocklist.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrl: './dashbaord.component.css',
})
export class DashbaordComponent implements OnInit {
  userInfo: UserModel | null = null;
  totalBooking: number = 0; 
  totalMotor: number = 0; 
  totalCategory: number = 0; 
  totalUsers: number = 0; 
  totalPending: number = 0; 
  totalRenting: number = 0; 

  readonly #destroyRef = inject(DestroyRef);
  #timeoutID: ReturnType<typeof setTimeout> | undefined = undefined;

  dataBar: any = null;
  dataDoughnut: any = {}; 
  constructor(
    private bookinghistory: BookingHistoryService,
    private auth: AuthService, private motors:MotorService,private userService: LoginService,
    private category: CategoriesService, 
    private blocklistService: BlocklistService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {   this.#destroyRef.onDestroy(() => {
    clearTimeout(this.#timeoutID);
  });
}

  

  
  ngOnInit() {
    this.userInfo = this.auth.userInfo; // Get user info
    this.loadAllBookings();
    this.loadMotors();
    this.loadCategory();
    this.loadUsers();
    this.totalpending();
    this.totalrenting();
    this.loadAllBlocklist();
    this.fetchBookingData();
  }
  @Input() data: any;

  fetchBookingData() {
    const apiUrl = 'http://localhost:3000/booking'; // Palitan ito ng tamang API endpoint
  
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        console.log('API Response:', response); // I-log ang response para makita ang data
  
        // Transform API response for bar chart (monthly data)
        const labelsBar = response.map((booking) =>
          new Date(booking.pickup_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        );
  
        const amountsBar = response.map((booking) => booking.total_amount);
  
        this.dataBar = {
          labels: labelsBar,
          datasets: [
            {
              label: 'Total Amount (PHP)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              data: amountsBar,
            },
          ],
        };
  
        // Pagkuha ng motor categories at pagbilang ng bawat category
        const categoryNames = response.reduce((acc, booking) => {
          const category = booking.motor.motorCategory.category_name; // Kunin ang category_name mula sa motorCategory
          if (category) {
            acc[category] = (acc[category] || 0) + 1; // Bibilangin ang motor sa bawat category
          }
          return acc;
        }, {} as { [key: string]: number });
  
        console.log('Category Names:', categoryNames); // I-log ang category count para makita ang pagbilang
  
        // Pag-prepare ng data para sa doughnut chart
        const categoryLabels = Object.keys(categoryNames);
        const categoryData = Object.values(categoryNames);
  
        this.dataDoughnut = {
          labels: categoryLabels,
          datasets: [
            {
              label: 'Motor Category Booking Count',
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
              data: categoryData,
            },
          ],
        };
  
        console.log('Doughnut Chart Data:', this.dataDoughnut); // I-log ang doughnut chart data
  
        this.cdr.detectChanges(); // Trigger ang change detection upang makita ang update
      },
      (error) => {
        console.error('Error fetching booking data:', error);
      }
    );
  }
  
handleChartRef($chartRef: any) {
  if ($chartRef) {
    console.log('handleChartRef', $chartRef);
    this.#timeoutID = setTimeout(() => {
      // Simulate adding new booking data dynamically (optional)
      const newBooking = {
        pickup_date: '2024-12-01',
        total_amount: 900,
        motor_category_name: 'Honda', // Assuming new booking has category info
      };

      // Update bar chart data
      this.dataBar.labels.push(
        new Date(newBooking.pickup_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      );
      this.dataBar.datasets[0].data.push(newBooking.total_amount);

      // Update doughnut chart data (category-wise count)
      const categoryIndex = this.dataDoughnut.labels.indexOf(newBooking.motor_category_name);
      if (categoryIndex >= 0) {
        this.dataDoughnut.datasets[0].data[categoryIndex]++;
      } else {
        this.dataDoughnut.labels.push(newBooking.motor_category_name);
        this.dataDoughnut.datasets[0].data.push(1);
      }

      $chartRef.update();
      this.#timeoutID = undefined;
    }, 3000);
  }
}

  
  
  loadAllBookings() {
    this.bookinghistory.getAllBookingHistory().subscribe((res: any[]) => {
      this.totalBooking = res.length
    });
  }

  loadMotors(): void {
    this.motors.getAllmotors().subscribe(
      (data) => {
        this.totalMotor = data.motors.length
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  totalpending(): void {
    this.bookinghistory.getAllBookingPending().subscribe(
      (data) => {
        this.totalPending = data
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  totalrenting(): void {
    this.bookinghistory.getAllBookingRenting().subscribe(
      (data) => {
        this.totalRenting = data
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  loadCategory(): void {
    this.category.getAllCategories().subscribe(
      (data) => {

        
        this.totalCategory = data.length
        
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  loadUsers(): void {
    this.userService.getAllUser().subscribe(
      (data) => {
       this.totalUsers = data.length
      
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  allblocklist: any[] = [];

  loadAllBlocklist(): void {
    this.blocklistService.getAllBlockUser().subscribe(
      (data) => {
        this.allblocklist = data.length
      console.log( this.allblocklist );
      
      },
      (error) => {
        console.error('Error loading blocklist:', error);
      }
    );
  }









  barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Sales',
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        data: [65, 59, 80, 81, 56, 45, 70, 90, 75, 60, 50, 85],
      },
    ],
  };
  

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };


  
}
