import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingComponent } from './booking/booking.component';
import { MotorComponent } from './motor/motor.component';
import { CATEGORIESComponent } from './categories/categories.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { BlocklistComponent } from './blocklist/blocklist.component';
import { TrackingComponent } from './tracking/tracking.component';
import { SettingsComponent } from './settings/settings.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { MaterialModule } from '../material-module';
import { UpdateUserComponent } from './update-user/update-user.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddMotorComponent } from './add-motor/add-motor.component';
import { AddCategoriesComponent } from './add-categories/add-categories.component';
import { FullImageComponent } from './full-image/full-image.component';
import { AddBlocklistComponent } from './add-blocklist/add-blocklist.component';
import { UpdateBookingComponent } from './update-booking/update-booking.component';
import { LocationComponent } from './location/location.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { ViewMotorComponent } from './view-motor/view-motor.component';
import { BookingReportComponent } from './booking-report/booking-report.component';
import { UserReportComponent } from './user-report/user-report.component';
import { ManageRentComponent } from './manage-rent/manage-rent.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { RentalReportComponent } from './rental-report/rental-report.component';
import { UpdateMotorComponent } from './update-motor/update-motor.component';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { MotorReportComponent } from './motor-report/motor-report.component';
import { AddPenaltyComponent } from './add-penalty/add-penalty.component';
import { RentalReceiptComponent } from './rental-receipt/rental-receipt.component';



@NgModule({
  declarations: [
    BookingComponent,
    MotorComponent,
    CATEGORIESComponent,
    BlocklistComponent,
    TrackingComponent,
    SettingsComponent,
    BookingDetailsComponent,
    UpdateUserComponent,
    AddCategoriesComponent,
    FullImageComponent,
    AddBlocklistComponent,
    UpdateBookingComponent,
    LocationComponent,
    UpdateCategoryComponent,
    ViewMotorComponent,
    BookingReportComponent,
    UserReportComponent,
    ManageRentComponent,
    AddPaymentComponent,
    SalesReportComponent,
    RentalReportComponent,
    UpdateMotorComponent,
    NotificationModalComponent,
    MotorReportComponent,
    AddPenaltyComponent,
    RentalReceiptComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule
  ]
})
export class AdminPagesModule { }
