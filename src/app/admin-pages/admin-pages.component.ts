import { BookingHistoryService } from './../services/booking-history.service';
import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, NavigationEnd,Router } from '@angular/router';
import { filter } from 'rxjs/operators'; 
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../interface/UserModel';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-pages',
  templateUrl: './admin-pages.component.html',
  styleUrl: './admin-pages.component.css'
})
export class AdminPagesComponent implements OnInit {
  public headerTitle: string = 'Dashboard';
  sidebarOpen = true;
  activeLink: string = 'dashboard';
  reportsDropdownOpen = false; 
  userInfo: UserModel | null = null;
  showNotification: boolean = false; 


  sidebarLinks = [
    { key: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
    { key: 'booking', label: 'Bookings', path: '/admin/booking', icon: '📖' },
    { key: 'rental', label: 'Rentals', path: '/admin/rental', icon: '📖' },
    { key: 'motor', label: 'Motorcycle', path: '/admin/motor', icon: '🏍️' },
    { key: 'verify-user', label: 'Verify Users', path: '/admin/verify-user', icon: '👤' },
    { key: 'blocklist', label: 'Blocklist', path: '/admin/blocklist', icon: '🚫' },
    { key: 'categories', label: 'Categories', path: '/admin/categories', icon: '🏷️' },
    { 
      key: 'reports', 
      label: 'Reports', 
      icon: '📊', 
      dropdown: true,
      children: [
        { key: 'Booking Report', label: 'Booking Report', path: '/admin/booking-report' },
        { key: 'Rental Report', label: 'Rental Report', path: '/admin/rental-report' },
        { key: 'User Reports', label: 'User Reports', path: '/admin/user-report' },
        { key: 'Sales Report', label: 'Sales Report', path: '/admin/sales-report' },
        { key: 'Motor Report', label: 'Motorcycle Report', path: '/admin/motor-report' }
      ]
    },
    { key: 'settings', label: 'Settings', path: '/admin/settings', icon: '⚙️' },
    
  ];


  constructor(private router: Router, private activatedRoute: ActivatedRoute,private auth:AuthService,private admin:BookingHistoryService,private dialog: MatDialog){
    this.loadNotification()
  }

  setActiveLink(link: string) {
    this.activeLink = link;
    this.reportsDropdownOpen = false;  
  }

  toggleReportsDropdown() {
    this.reportsDropdownOpen = !this.reportsDropdownOpen;
  }


 toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd)) 
      .subscribe(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }

        if (route?.snapshot.data['title']) {
          this.headerTitle = route.snapshot.data['title'];
        } else {
          this.headerTitle = 'Dashboard'; 
        }
      });


      this.userInfo = this.auth.getUserInfo();  
  }

  logout() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logout();
  
      
        Swal.fire({
          title: "Logout!",
          text: "Logout successfully.",
          icon: "success"
        }).then(() => {
          this.router.navigate(['/']); 
          window.location.reload();
        });
      }
    });
  }
  notifNumber: number = 0;
  m:any
  loadNotification(): void {
    this.admin.getNotification().subscribe(
      (res: any) => {
  
        if (Array.isArray(res) && res.length > 0) {
          this.m = res.map((notification: any) => notification.message);
          this.notifNumber = res.length;
        } else {
          this.m = []
          this.notifNumber = 0;
        }
      },
      (error) => {
        console.error('Error loading notifications:', error);
      }
    );
  }
  

  resetNotificationCount(): void {
    this.showNotification = !this.showNotification;
    this.notifNumber = 0;
  }
  
}
