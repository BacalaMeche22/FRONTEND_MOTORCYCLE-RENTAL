import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage.component';
import { LoginComponent } from '../login/login.component';

const routes: Routes = [
  {
    path: 'landing-page',
    component: LandingpageComponent,
    children: [
      
    ]
  }

]
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class LandingpageRoutingModule { }
