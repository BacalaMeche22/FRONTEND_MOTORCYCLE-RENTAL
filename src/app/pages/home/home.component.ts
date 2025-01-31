import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  autoSlideInterval: any;

  slides = [
    { image: 'https://firebasestorage.googleapis.com/v0/b/mobi-pms.appspot.com/o/motors%2Fquality_restoration_20240906114116571.png?alt=media&token=9f1c497c-c378-4af2-a890-f2b05a1b2225' },
    { image: 'https://firebasestorage.googleapis.com/v0/b/mobi-pms.appspot.com/o/motors%2Fquality_restoration_20240906113928372.png?alt=media&token=21acdb59-b757-4cdd-82a1-177759d212a8' },
    { image: 'https://firebasestorage.googleapis.com/v0/b/mobi-pms.appspot.com/o/motors%2Fquality_restoration_20240906114014868.png?alt=media&token=a8fd2920-0984-4bad-8d29-3431e1c3f826' },
    { image: 'https://firebasestorage.googleapis.com/v0/b/mobi-pms.appspot.com/o/new-motor%2Fquality_restoration_20240906112331779.png?alt=media&token=6b08a5d8-0cf8-4d14-a11f-2d085b1d382b' },
    { image: 'https://firebasestorage.googleapis.com/v0/b/mobi-pms.appspot.com/o/motors%2Fquality_restoration_20240906114206938.png?alt=media&token=c14a7d2e-45e9-4b83-87c4-7792b42507b8' },
  ];

  constructor(private cdRef: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    clearInterval(this.autoSlideInterval);
  }

  startAutoSlide() {
    this.zone.runOutsideAngular(() => {
      this.autoSlideInterval = setInterval(() => {
        this.zone.run(() => {
          this.nextSlide();
        });
      }, 5000);
    });
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide > 0) ? this.currentSlide - 1 : this.slides.length - 1;
    this.cdRef.markForCheck();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.cdRef.markForCheck();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.cdRef.markForCheck();
  }
}
