import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminPagesComponent } from './admin-pages.component';
import { DashbaordComponent } from './dashboard/dashboard.component';
import { BlocklistComponent } from './blocklist/blocklist.component';
import { BookingComponent } from './booking/booking.component';
import { CATEGORIESComponent } from './categories/categories.component';
import { MotorComponent } from './motor/motor.component';
import { SettingsComponent } from './settings/settings.component';
import { TrackingComponent } from './tracking/tracking.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { AddMotorComponent } from './add-motor/add-motor.component';
import { ManageRentComponent } from './manage-rent/manage-rent.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminPagesComponent,
    title: 'Admin',
    children: [
      { path: 'dashboard', component: DashbaordComponent , data: { title: 'Dashboard' },},
      { path: 'booking', component: BookingComponent , data: { title: 'booking' }},
      { path: 'renter', component: ManageRentComponent , data: { title: 'renter' }},
      { path: 'categories', component: CATEGORIESComponent , data: { title: 'categories' }},
      { path: 'motor', component: MotorComponent , data: { title: 'Motorcycles' }},
      { path: 'settings', component: SettingsComponent , data: { title: 'settings' }},
      { path: 'tracking', component: TrackingComponent , data: { title: 'tracking' }},
      { path: 'verify-user', component: VerifyUserComponent, data: { title: 'verify-User' }},
      { path: 'blocklist', component: BlocklistComponent , data: { title: 'blocklist' }},
      { path: 'add-motor', component: AddMotorComponent , data: { title: 'add-motor' }},
      { path: 'booking-details/:id', component: BookingDetailsComponent, data: { title: 'Booking Details' } },


    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AdminRoutingModule { }

