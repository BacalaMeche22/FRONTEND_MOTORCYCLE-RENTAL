import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LoginService } from '../../services/login.service';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css'],
  animations: [
    trigger('slideToggle', [
      state('hidden', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('visible', style({ height: '*', opacity: 1 })),
      transition('hidden <=> visible', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class VerifyUserComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  isDateRangeVisible: boolean = false;
  selectedStatus = '';
  originalData: any[] = [];

  displayedColumns: string[] = ['index', 'name', 'email', 'role', 'phone', 'created_at', 'status', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  startDate: Date | null = null;
  endDate: Date | null = null;
  minDate: Date = new Date(); 

  constructor(private userService: LoginService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  toggleDateRangeVisibility() {
    this.isDateRangeVisible = !this.isDateRangeVisible;
  }

  loadUsers(): void {
    this.userService.getAllUser().subscribe(
      (data) => {
        this.originalData = data; 
        this.dataSource.data = [...this.originalData]; 
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  

  applyStatusFilter() {
    if (this.selectedStatus) {
      this.dataSource.data = this.originalData.filter((user: any) =>
        this.selectedStatus === 'Verified' ? user.status === true : user.status === false
      );
    } else {
      this.dataSource.data = [...this.originalData];
    }
  }



  getStatusClass(user: any) {
    if (user.status === true) return 'Verified';
    if (user.status === false) return 'Not Verified';
    return '';
  }

  applyDateFilter() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate).setHours(0, 0, 0, 0);
      const end = new Date(this.endDate).setHours(23, 59, 59, 999);
  
      const filteredData = this.originalData.filter((user: any) => {
        const createdAt = new Date(user.created_at).getTime(); 
        return createdAt >= start && createdAt <= end;
      });
  
      this.dataSource.data = filteredData;
    } else {
      console.warn('Start date or end date is missing');
    }
  }
  

  resetFilters() {
    this.dataSource.data = [...this.originalData]; 
    this.startDate = null;
    this.endDate = null;
  }
  
  


  filterToday() {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.applyDateFilter();
  }

  filterYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    this.endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    this.applyDateFilter();
  }

  filterThisMonth() {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.applyDateFilter();
  }

  openUpdateUserModal(userId: string): void {
    const selectedUser = this.dataSource.data.find((u: any) => u.user_id === userId);
    if (selectedUser) {
      const dialogRef = this.dialog.open(UpdateUserComponent, {
        width: '30rem',
        height: '90vh',
        panelClass: 'custom-dialog',
        data: selectedUser
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadUsers();
        }
      });
    }
  }
}
