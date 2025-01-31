import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MotorService } from '../../services/motor.service';
import { AddMotorComponent } from '../add-motor/add-motor.component';
import { ViewMotorComponent } from '../view-motor/view-motor.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UpdateMotorComponent } from '../update-motor/update-motor.component';

@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.css'],
  animations: [
    trigger('slideToggle', [
      state('hidden', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('visible', style({ height: '*', opacity: 1 })),
      transition('hidden <=> visible', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class MotorComponent implements OnInit {
  displayedColumns: string[] = ['index','model', 'price', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  isDateRangeVisible: boolean = false;
  selectedStatus = '';
  originalData: any[] = [];



  


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  startDate: Date | null = null;
  endDate: Date | null = null;
  minDate: Date = new Date(); 

  constructor(private dialog: MatDialog, private motors: MotorService) {}

  ngOnInit(): void {
    this.loadMotors();
  }

  loadMotors(): void {
    this.motors.getAllmotors().subscribe(
      (data) => {
        this.originalData = data.motors; 
        this.dataSource.data = [...this.originalData];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error fetching motors:', error);
      }
    );
  }
  




  toggleDateRangeVisibility() {
    this.isDateRangeVisible = !this.isDateRangeVisible;
  }

  applyStatusFilter() {
    if (this.selectedStatus) {
      this.dataSource.data = this.originalData.filter((motor: any) =>
        this.getStatusClass(motor) === this.selectedStatus
      );
    } else {
      this.dataSource.data = [...this.originalData];
    }
  }


  getStatusClass(motor: any) {
    if (motor.isVisible === true) return 'Availabe';
    if (motor.isVisible === false) return 'Not Available';

    return '';
  }

  applyDateFilter() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate).setHours(0, 0, 0, 0); 
      const end = new Date(this.endDate).setHours(23, 59, 59, 999); 
  
      const filteredData = this.originalData.filter((motor: any) => {
        const motorDate = new Date(motor.created_at).getTime();
        return motorDate >= start && motorDate <= end;
      });
  
      this.dataSource.data = filteredData;
  
      if (filteredData.length === 0) {
        console.warn('No data matches the selected date range.');
      }
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











  openAddMotorDialog(): void {
    const dialogRef = this.dialog.open(AddMotorComponent, {
      width: 'auto',
      height: '90vh',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(() => this.loadMotors());
  }

  openViewMotorDialog(motorId: string): void {
    const selectedMotor = this.dataSource.data.find((motor: any) => motor.motor_id === motorId);
    if (selectedMotor) {
      const dialogRef = this.dialog.open(ViewMotorComponent, {
        width: '50rem',
        height: '90vh',
        panelClass: 'custom-dialog',
        data: selectedMotor
      });

      dialogRef.afterClosed().subscribe(() => this.loadMotors());
    }
  }

  openEditMotorDialog(motorId: string): void {
    const selectedMotor = this.dataSource.data.find((motor: any) => motor.motor_id === motorId);
    if (selectedMotor) {
      const dialogRef = this.dialog.open(UpdateMotorComponent, {
        width: '50rem',
        height: '90vh',
        panelClass: 'custom-dialog',
        data: selectedMotor
      });

      dialogRef.afterClosed().subscribe(() => this.loadMotors());
    }
  }

  deleteMotor(motorId: string): void {
    Swal.fire({
      title: 'Are you sure you want to delete this motor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.motors.deleteMotor(motorId).subscribe(
          () => {
            Swal.fire('Deleted!', 'The motor has been deleted.', 'success');
            this.loadMotors();
          },
          (error) => {
            console.error(`Error deleting motor with ID ${motorId}:`, error);
            Swal.fire('Error', 'There was a problem deleting the motor.', 'error');
          }
        );
      }
    });
  }


}
