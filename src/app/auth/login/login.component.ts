import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import{ AuthService } from '../auth.service';
import {Subscription} from 'rxjs'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy{
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
  onLogin(form:NgForm){
    if(form.invalid){
      return
    }
    this.isloading=true;
    this.authService.login(form.value.email, form.value.password)
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe()
  }
}
