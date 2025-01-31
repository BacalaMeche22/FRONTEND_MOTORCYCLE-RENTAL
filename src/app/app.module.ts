import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ContactComponent } from './pages/contact/contact.component';
import { GetMotorcycleComponent } from './pages/get-motorcycle/get-motorcycle.component';
import { AboutComponent } from './pages/about/about.component';
import { TermConditionsComponent } from './pages/term-conditions/term-conditions.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AdminPagesComponent } from './admin-pages/admin-pages.component';
import { DashbaordComponent } from './admin-pages/dashboard/dashboard.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material-module';
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from '../environments/environment.development';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { BookingHistoryComponent } from './pages/booking-history/booking-history.component';
import { ViewBookingComponent } from './pages/view-booking/view-booking.component';
import { CancelComponent } from './pages/cancel/cancel.component';
import { CommonModule, IMAGE_CONFIG } from '@angular/common';
import { VerifyUserComponent } from './admin-pages/verify-user/verify-user.component';
import { AddMotorComponent } from './admin-pages/add-motor/add-motor.component';
import { AdminPagesModule } from './admin-pages/admin-pages.module';
import { ProfileSettingsComponent } from './pages/profile-settings/profile-settings.component';
import { NotauthorizedComponent } from './pages/notauthorized/notauthorized.component';
import { ApprovedBookingComponent } from './pages/approved-booking/approved-booking.component';
import { RentalTableComponent } from './pages/rental-table/rental-table.component';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { LoadingPageComponent } from './pages/loading-page/loading-page.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingpageComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ContactComponent,
    GetMotorcycleComponent,
    AboutComponent,
    TermConditionsComponent,
    AdminPagesComponent,
    DashbaordComponent,
    BookingPageComponent,
    PaymentComponent,
    ConfirmationComponent,
    BookingHistoryComponent,
    ViewBookingComponent,
    CancelComponent,
    VerifyUserComponent,
    AddMotorComponent,
    ProfileSettingsComponent,
    NotauthorizedComponent,
    ApprovedBookingComponent,
    RentalTableComponent,
    LoadingPageComponent,
    
    
  ],
  imports: [
    FormsModule  ,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AdminPagesModule,
    ChartjsModule,
    ChartjsModule,
    MaterialModule,
    SweetAlert2Module.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig)

    
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    { provide: IMAGE_CONFIG, useValue: { disableImageSizeWarning: true, disableImageLazyLoadWarning: true } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
