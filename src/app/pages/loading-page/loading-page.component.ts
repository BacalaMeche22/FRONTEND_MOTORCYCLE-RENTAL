import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrl: './loading-page.component.css'
})
export class LoadingPageComponent implements OnInit{
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    this.authService.getLoadingState().subscribe((loadingState) => {
      this.isLoading = loadingState;
    });
  }



}
