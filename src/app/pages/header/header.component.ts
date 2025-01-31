import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserModel } from '../../interface/UserModel';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { BookingHistoryService } from '../../services/booking-history.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { ProfileSettingsComponent } from '../profile-settings/profile-settings.component';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;
  isDropdownOpened = false;
  userInfo: UserModel | null = null;
  activeSection: string = '';
  allbooking: any[] = [];
  allcategories: any[] = [];
  user: any;
  profile: any;
  isMenuOpen = false;




  @Output() categorySelected = new EventEmitter<string>();

  constructor(
    private categories: CategoriesService,
    private router: Router,
    private auth: AuthService,
    private bookingService: BookingService,
    private bookinghistory: BookingHistoryService,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) { }
  isMobile: boolean = false;
  ngOnInit() {
    this.userInfo = this.auth.getUserInfo();
    this.user = this.auth.userInfo?.user_id;
    this.profile = this.auth.userInfo?.profile_pic;
    console.log(this.profile);

    this.loadAllBookings();
    this.loadAllCategories();

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });


    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const sectionId = localStorage.getItem('scrollToSection');
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          this.activeSection = sectionId;
        }
  
        localStorage.removeItem('scrollToSection');
      }
    }
  }

  loadAllBookings() {
    this.bookinghistory.getAllBookingHistory().subscribe((res) => {
      this.allbooking = res.filter(
        (booking: any) => booking.user.user_id === this.userInfo?.user_id
      );
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  catDropdown() {
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  scrollToSection(sectionId: string): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('scrollToSection', sectionId);
      window.location.reload();
    }
  }
  

  loadAllCategories(): void {
    this.categories.getAllCategories().subscribe(
      (data) => {
        this.allcategories = data;
      },
      (error) => { }
    );
  }

  scrollToCategory(category: any): void {
    this.categorySelected.emit(category.category_name);
    this.isDropdownOpened = false;
    const element = document.getElementById('get-motorcycle-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openUpdateUserModal(user?: any): void {
    const dialogRef = this.dialog.open(ProfileSettingsComponent, {
      width: '30rem',
      height: 'auto',
      panelClass: 'custom-dialog',
      data: user || {},
    });

    if (user) {
      this.userInfo = this.auth.getUserInfo();
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logout();
        Swal.fire({
          title: 'Logout!',
          text: 'Logout successfully.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/']);
          window.location.reload();
        });
      }
    });
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


  toggleViewRentingPage() {
    this.bookingService.hidePaymentPage();
    this.bookingService.hideConfirmPage();
    this.bookingService.hideViewBookingPage();
    this.bookingService.hideBookingHistoryPage();
    this.bookingService.hideBookingPage();

    this.bookingService.showViewRentalPage();
  }




}
