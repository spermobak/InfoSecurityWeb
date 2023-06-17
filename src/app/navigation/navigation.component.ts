import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  sidenav!:MatSidenav;
  @Output() toggleSidenav: EventEmitter<void> = new EventEmitter<void>();
  isChecklistPage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.isChecklistPage = this.router.url === '/checklist';
    this.observeScreenSize();
  }

  observeScreenSize() {
    const mediaQuery = window.matchMedia('(max-width: 800px)');
    mediaQuery.addEventListener('change', (event) => {
      this.handleScreenSizeChange(event.matches);
    });
    this.handleScreenSizeChange(mediaQuery.matches);
  }

  handleScreenSizeChange(matches: boolean) {
    if (matches) {
      this.toggleSidenav.emit();
    }
  }
}
