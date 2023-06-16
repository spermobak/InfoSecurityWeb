import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})

export class WelcomeComponent {
    isRegistrationWindowVisible = false;
    isLoginFormVisible = false;

  openWindow() {
    this.isRegistrationWindowVisible = true;
    this.isLoginFormVisible = false;
  }

  closeWindow() {
    this.isRegistrationWindowVisible = false;
  }
}
