import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})

export class LoginComponent {

  miFormulario: FormGroup = this._formBuilder.group({
    email: ['test1@test.com', [Validators.required, Validators.email] ],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private _formBuilder: FormBuilder,
              private _router: Router,
              private _authService: AuthService ) { }

  login(){
    console.log(this.miFormulario.value);

    const {email, password} = this.miFormulario.value
    
    this._authService.login(email, password)
      .subscribe( ok => {
        if (ok === true) {
          this._router.navigateByUrl('/dashboard')
        } else {
          Swal.fire('Error',ok,'error')
        }
      });
  }
}
