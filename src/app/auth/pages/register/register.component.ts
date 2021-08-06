import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

  miFormulario: FormGroup = this._formBuilder.group({
    name:     [ 'Test 4', Validators.required ],
    email:    [ 'test4@test.com', [Validators.required, Validators.email] ],
    password: [ '123456', [Validators.required,Validators.minLength(6)] ]
  });

  constructor(private _formBuilder: FormBuilder,
              private _router: Router,
              private _authService: AuthService ) { }

  ngOnInit(): void {
  }

  register(){
    const {name, email, password} = this.miFormulario.value

    this._authService.registro(name, email, password)
      .subscribe( ok => {
        if (ok === true) {
          this._router.navigateByUrl('/dashboard')
        } else {
          Swal.fire('Error',ok,'error')
        }
      });
  }

}
