import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loginFailed: boolean = false;

  constructor(private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/home']);
    }
  }

  onLogin() {
      if (this.username === 'admin' && this.password === 'admin') {
          sessionStorage.setItem('isLoggedIn', 'true');
          this._snackBar.open('Boas vindas, Admin!', 'Fechar', {
              duration: 5000
          });
          this.router.navigate(['/home']);
      } else {
          this.loginFailed = true;
      }
  }
}
