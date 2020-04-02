import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../../auth/auth.service'
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  userIsAuthenticated=false
private authListnerSubs:Subscription;
  constructor(private AuthService:AuthService) { }

  ngOnInit(): void {
   this.userIsAuthenticated = this.AuthService.getIsAuth();
    this.authListnerSubs= this.AuthService.getauthStatusListner().subscribe(isAuthenticated=>{
      //console.log("Obesrable result",isAuthenticated)
      this.userIsAuthenticated=isAuthenticated  
    })
  }
  onLogout(){
    this.AuthService.logout()
  }
ngOnDestroy(){
  this.authListnerSubs.unsubscribe()
}
}
