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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashbaordComponent implements OnInit {
  userInfo: UserModel | null = null;
  pickupData: any[] = []; 
  todayPickupData: any[] = [];
  countdowns: { [key: string]: string } = {}; 
  countdownInterval: any; 
  totalBooking: number = 0; 
  totalMotor: number = 0; 
  totalCategory: number = 0; 
  totalUsers: number = 0; 
  totalPending: number = 0; 
  totalRenting: number = 0; 

  readonly #destroyRef = inject(DestroyRef);
  #timeoutID: ReturnType<typeof setTimeout> | undefined = undefined;

  dataBar: any = null;
  dataDoughnut: any = { labels: [], datasets: [] };

  constructor(
    private bookinghistory: BookingHistoryService,
    private auth: AuthService, private motors:MotorService
    ,private userService: LoginService,
    private category: CategoriesService, 
    private blocklistService: BlocklistService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {   this.#destroyRef.onDestroy(() => {
    clearTimeout(this.#timeoutID);
  });
}
  
  ngOnInit() {
    this.userInfo = this.auth.userInfo; 
    this.loadAllBookings();
    this.loadMotors();
    this.loadCategory();
    this.loadUsers();
    this.totalpending();
    this.totalrenting();
    this.loadAllBlocklist();
    this.fetchBookingData();
    this.loadAllPickupDay();
    this.loadAlVisibleMotors();
    this.loadAlInVisibleMotors();

    this.countdownInterval = setInterval(() => {
      this.updateCountdowns();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
  @Input() data: any;

  fetchBookingData() {
    const apiUrl = 'http://localhost:3000/booking'; 
  
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
  
        
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
  
       
        const categoryNames = response.reduce((acc, booking) => {
          const category = booking.motor.motorCategory.category_name; 
          if (category) {
            acc[category] = (acc[category] || 0) + 1; 
          }
          return acc;
        }, {} as { [key: string]: number });
  
  
       
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
  
  
        this.cdr.detectChanges(); 
      },
      (error) => {
        console.error('Error fetching booking data:', error);
      }
    );
  }
  
handleChartRef($chartRef: any) {
  if ($chartRef) {
    this.#timeoutID = setTimeout(() => {
    
      const newBooking = {
        pickup_date: '2024-12-01',
        total_amount: 900,
        motor_category_name: 'Honda',
      };


      this.dataBar.labels.push(
        new Date(newBooking.pickup_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      );
      this.dataBar.datasets[0].data.push(newBooking.total_amount);

    
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

toBeReturnBookings: any[] = [];
  
loadAllBookings() {
  this.bookinghistory.getAllBookingHistory().subscribe(
    (res: any[]) => {

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.toBeReturnBookings = res.filter((booking) => {
        const returnDate = new Date(booking.return_date);
        returnDate.setHours(0, 0, 0, 0); 
        return returnDate.getTime() === today.getTime();
      });

    }
  );
}

 
loadAllPickupDay() {
  this.bookinghistory.getAllPickupDate().subscribe((res: any[]) => {
    const now = new Date();

    this.todayPickupData = res.filter(item => {
      const pickupDate = new Date(item.pickup_date);
      return pickupDate.toDateString() === now.toDateString(); 
    });

    this.todayPickupData.forEach(item => {
      this.countdowns[item.pickup_date] = this.getCountdown(item.pickup_date);
    });
  });
}

updateCountdowns() {
  this.todayPickupData.forEach(item => {
    this.countdowns[item.pickup_date] = this.getCountdown(item.pickup_date);
  });
}

calculateCountdown(returnDate: string): string {
  const now = new Date().getTime();
  const returnTime = new Date(returnDate).getTime();
  const difference = returnTime - now;

  if (difference <= 0) {
    return '00:00:00';
  }

  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


 
getCountdown(pickupDate: string): string {
  const now = new Date().getTime(); 
  const pickupTime = new Date(pickupDate).getTime(); 

  const difference = pickupTime - now; 

  if (difference <= 0) {
    return 'Expired'; 
  }

  const hours = Math.floor(difference / (1000 * 60 * 60)); 
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)); 
  const seconds = Math.floor((difference % (1000 * 60)) / 1000); 

  return `${hours}h ${minutes}m ${seconds}s`; 
}

  loadMotors(): void {
    this.motors.getAllmotors().subscribe(
      (data) => {
        this.totalMotor = data?.motors.length
      }
    );
  }

  totalpending(): void {
    this.bookinghistory.getAllBookingPending().subscribe(
      (data) => {
        this.totalPending = data
      }
    );
  }

  totalrenting(): void {
    this.bookinghistory.getAllBookingRenting().subscribe(
      (data) => {
        this.totalRenting = data
      }
    );
  }

  loadCategory(): void {
    this.category.getAllCategories().subscribe(
      (data) => {

        
        this.totalCategory = data?.length
        
      }
    );
  }

  loadUsers(): void {
    this.userService.getAllUser().subscribe(
      (data) => {
       this.totalUsers = data.length
      
      }
    );
  }
  allblocklist: any[] = [];

  loadAllBlocklist(): void {
    this.blocklistService.getAllBlockUser().subscribe(
      (data) => {
        this.allblocklist = data?.length
      
      }
    );
  }

  allvisible:any;

  loadAlVisibleMotors(): void {
    this.motors.getAllAvailableMotors().subscribe(
      (data) => {
        this.allvisible = data?.total
      }
     
    );
  }

  allInvisible:any;

  loadAlInVisibleMotors(): void {
    this.motors.getAllUnavailableMotors().subscribe(
      (data) => {
        this.allInvisible = data?.total
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
