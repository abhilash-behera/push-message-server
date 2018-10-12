import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginButtonDisabled: Boolean;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService,
    private matSnackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    if (this.loginForm.valid) {
      this.loginButtonDisabled = true;
      this.apiService.login(this.loginForm.value).subscribe(
        data => {
          if (Object(data).success) {
            this.matSnackBar.open('Authentication Successful', 'Okay', { duration: 5000 });
            localStorage.setItem('token', Object(data).data);
            this.router.navigate(['/dashboard']);
          } else {
            this.loginButtonDisabled = false;
            this.matSnackBar.open(Object(data).data, 'Okay', { duration: 5000 });
          }
        }, error => {
          this.loginButtonDisabled = false;
          this.matSnackBar.open('Something went wrong. Please try again', 'Okay',
            { duration: 5000 });
        }
      );
    }
  }

}
