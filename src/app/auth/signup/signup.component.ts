import { Component, OnInit, OnDestroy } from '@angular/core';
import{ AuthService } from '../auth.service'
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isloading=false;
  private authStatusSub:Subscription;
  constructor(public authService:AuthService) {

   }

  ngOnInit(): void {
    this.authStatusSub=this.authService.getauthStatusListner().subscribe(
      authStats=>{
      this.isloading=false
    })

  }
  onSignup(form:NgForm)
  {
    if(form.invalid){
      return;
    }
    this.isloading=true;

    this.authService.createSecureServer(form.value.email,form.value.password)
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe()
  }
}
