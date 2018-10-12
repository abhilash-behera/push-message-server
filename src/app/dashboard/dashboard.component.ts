import { Component, OnInit, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  notificationForm: FormGroup;
  isAtleastOneSelected: boolean;
  isAppsError: boolean;
  sendButtonDisabled: boolean;
  constructor(private apiService: ApiService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router) {

  }

  ngOnInit() {
    this.notificationForm = this.formBuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      apps: this.formBuilder.group({
        footballPredictions: [false],
        epicPredictions: [false],
        coolPredictions: [false]
      })
    });
  }

  submitNotificationForm() {
    this.isAtleastOneSelected = this.footballPredictions.value || this.epicPredictions.value || this.coolPredictions.value;

    if (this.isAtleastOneSelected) {
      this.isAppsError = false;
      if (this.notificationForm.valid) {
        console.log(this.notificationForm.value);
        this.sendButtonDisabled = true;

        const notification = this.notificationForm.value;

        if (notification.apps.footballPredictions) {
          this.sendNotification(notification.title, notification.message, 'footballPredictions');
        }
        if (notification.apps.epicPredictions) {
          this.sendNotification(notification.title, notification.message, 'epicPredictions');
        }
        if (notification.apps.coolPredictions) {
          this.sendNotification(notification.title, notification.message, 'coolPredictions');
        }
      } else {
        console.log('Form invalid');
      }
    } else {
      this.isAppsError = true;
    }

  }

  sendNotification(title: string, message: string, app: string) {
    console.log('Sending notification to ', app);
    this.apiService.sendNotification({
      title: title,
      message: message,
      app: app
    }).subscribe(
      data => {
        this.sendButtonDisabled = false;
        if (Object(data).success) {
          this.toastr.success('Notification sent successfully', app);
        } else {
          this.toastr.error('Notification not sent', app);
        }
      },
      error => {
        this.sendButtonDisabled = false;
        this.toastr.error('Something went wrong while sending notification', app);
      }
    );
  }

  logout() {
    localStorage.clear();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }

  get title() {
    return this.notificationForm.get('title');
  }

  get message() {
    return this.notificationForm.get('message');
  }

  get footballPredictions() {
    return this.notificationForm.get('apps').get('footballPredictions');
  }

  get epicPredictions() {
    return this.notificationForm.get('apps').get('epicPredictions');
  }

  get coolPredictions() {
    return this.notificationForm.get('apps').get('coolPredictions');
  }
}
