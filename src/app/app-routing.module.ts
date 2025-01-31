import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TermConditionsComponent } from './pages/term-conditions/term-conditions.component';
import { AdminPagesComponent } from './admin-pages/admin-pages.component';
import { DashbaordComponent } from './admin-pages/dashboard/dashboard.component';
import { BookingComponent } from './admin-pages/booking/booking.component';
import { CATEGORIESComponent } from './admin-pages/categories/categories.component';
import { MotorComponent } from './admin-pages/motor/motor.component';
import { SettingsComponent } from './admin-pages/settings/settings.component';
import { TrackingComponent } from './admin-pages/tracking/tracking.component';
import { VerifyUserComponent } from './admin-pages/verify-user/verify-user.component';
import { BlocklistComponent } from './admin-pages/blocklist/blocklist.component';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { ViewBookingComponent } from './pages/view-booking/view-booking.component';
import { CancelComponent } from './pages/cancel/cancel.component';
import { AboutComponent } from './pages/about/about.component';
import { BookingHistoryComponent } from './pages/booking-history/booking-history.component';
import { AddMotorComponent } from './admin-pages/add-motor/add-motor.component';
import { UserReportComponent } from './admin-pages/user-report/user-report.component';
import { BookingReportComponent } from './admin-pages/booking-report/booking-report.component';
import { NotauthorizedComponent } from './pages/notauthorized/notauthorized.component';
import { AuthGuard } from './guard/auth.guard';
import { ProfileSettingsComponent } from './pages/profile-settings/profile-settings.component';
import { ApprovedBookingComponent } from './pages/approved-booking/approved-booking.component';
import { ManageRentComponent } from './admin-pages/manage-rent/manage-rent.component';
import { RentalReportComponent } from './admin-pages/rental-report/rental-report.component';
import { SalesReportComponent } from './admin-pages/sales-report/sales-report.component';
import { LoadingPageComponent } from './pages/loading-page/loading-page.component';
import { MotorReportComponent } from './admin-pages/motor-report/motor-report.component';


const routes: Routes = [
  {
    path: '',
    component: LandingpageComponent,
    title: 'Landing-Page'
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About',
  },
  
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'loading-page',
    component: LoadingPageComponent,
    title: 'Loading-page',
  },
  {
    path: 'booking-page',
    component: BookingPageComponent,
    title: 'Booking',
    canActivate: [AuthGuard]
  },

  {
    path: 'profile-setting',
    component: ProfileSettingsComponent,
    title: 'Profile-setting',
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    component: PaymentComponent,
    title: 'Payment',
    canActivate: [AuthGuard]
  },
  {
    path: 'notauthorized',
    component: NotauthorizedComponent,
    title: 'Notauthorized',
  },
  {
    path: 'confirmation',
    component: ConfirmationComponent,
    title: 'Confirmation',
    canActivate: [AuthGuard]
  },
  {
    path: 'view-booking',
    component: ViewBookingComponent,
    title: 'View-Booking',
    canActivate: [AuthGuard]
  },
  {
    path: 'booking-history',
    component: BookingHistoryComponent,
    title: 'Booking-History',
    canActivate: [AuthGuard]
  },
  
  {
    path: 'cancel-booking',
    component: CancelComponent,
    title: 'Cancel-Booking',
    canActivate: [AuthGuard]
  },
  {
    path: 'approved-booking',
    component: ApprovedBookingComponent,
    title: 'Approved-Booking',
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
  },
  {
    path: 'termcondition',
    component: TermConditionsComponent,
    title: 'Terms & Condition',
  },
  {
    path: 'admin',
    component: AdminPagesComponent,
    title: 'Admin',
    children: [
      { path: 'dashboard', component: DashbaordComponent , data: { title: 'Dashboard' },canActivate: [AuthGuard]},
      { path: 'booking', component: BookingComponent , data: { title: 'Manage Bookings' },canActivate: [AuthGuard]},
      { path: 'rental', component: ManageRentComponent , data: { title: 'Manage Rental' },canActivate: [AuthGuard]},
      { path: 'categories', component: CATEGORIESComponent , data: { title: 'Categories' },canActivate: [AuthGuard]},
      { path: 'motor', component: MotorComponent , data: { title: 'Motorcycles' },canActivate: [AuthGuard]},
      { path: 'settings', component: SettingsComponent , data: { title: 'Settings' },canActivate: [AuthGuard]},
      { path: 'tracking', component: TrackingComponent , data: { title: 'Tracking' },canActivate: [AuthGuard]},
      { path: 'verify-user', component: VerifyUserComponent, data: { title: 'Verify-user' },canActivate: [AuthGuard]},
      { path: 'blocklist', component: BlocklistComponent , data: { title: 'Blocklist' },canActivate: [AuthGuard]},
      { path: 'add-motor', component: AddMotorComponent , data: { title: 'Add-motor' },canActivate: [AuthGuard]},
      { path: 'booking-report', component: BookingReportComponent , data: { title: 'Booking Report' },canActivate: [AuthGuard]},
      { path: 'rental-report', component: RentalReportComponent , data: { title: 'Rental Report' },canActivate: [AuthGuard]},
      { path: 'user-report', component: UserReportComponent , data: { title: 'User Report' },canActivate: [AuthGuard]},
      { path: 'sales-report', component: SalesReportComponent , data: { title: 'Sales Report' },canActivate: [AuthGuard]},
      { path: 'motor-report', component: MotorReportComponent, data: { title: 'Motorcycle Report' },canActivate: [AuthGuard]},
    ],
  },

  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
