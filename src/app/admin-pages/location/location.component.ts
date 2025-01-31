import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BookingHistoryService } from '../../services/booking-history.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent implements OnInit, OnDestroy {
  currentData: { SclId: string; latitude: number; longitude: number } = {
    SclId: 'HAT-0',
    latitude: 0,
    longitude: 0
  };
  private updateInterval!: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.updateCoordinates();
    this.startUpdatingCoordinates();
  }

  startUpdatingCoordinates() {
    this.updateInterval = setInterval(() => {
      this.updateCoordinates();
    }, 2000); 
  }

  updateCoordinates() {
    const sclId = `HAT-${Math.floor(Math.random() * 10)}`; 
    const latitude = this.getRandomInRange(8.5, 9.5);     
    const longitude = this.getRandomInRange(124.5, 125.5); 

    this.currentData = { SclId: sclId, latitude, longitude };
  }

  getRandomInRange(min: number, max: number) {
    return +(Math.random() * (max - min) + min).toFixed(6);
  }

  ngOnDestroy() {
    clearInterval(this.updateInterval); 
  }
}
