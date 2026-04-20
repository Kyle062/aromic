import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash2',
  templateUrl: './splash2.page.html',
  styleUrls: ['./splash2.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class Splash2Page implements OnInit, OnDestroy {
  private timeoutId: any;

  constructor(private router: Router) {}

  ngOnInit() {
    const MIN_DISPLAY_TIME = 3000; 

    this.timeoutId = setTimeout(() => {
      const container = document.querySelector('.splash-container');
      if (container) {
        container.classList.add('exit-animation');
      }

      setTimeout(() => {
        this.router.navigate(['/splash']);
      }, 200);
    }, MIN_DISPLAY_TIME);
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
