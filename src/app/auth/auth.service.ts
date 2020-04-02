import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './authModel';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { error } from '@angular/compiler/src/util';
import { environment } from '../../environments/environment'
const url= environment.apiUrl
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token:string
  private isAuthenticated=false;
  private authStatusListner=new Subject<boolean>();
  private tokentimer:any
  private userId:string
  
  constructor(private http:HttpClient,private router:Router) { }
  gettoken(){
    return this.token;
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
  getUserId(){
    return this.userId
  }
  getauthStatusListner(){
      return this.authStatusListner.asObservable();
  }
    createSecureServer(email:string,password:string){
      const userData:AuthData={
        email:email,
        password:password
      }
      this.http.post<{message:string,result:any}>(url+'signup/',userData).subscribe((data)=>{
        console.log(data.message)
        this.router.navigate(['/'])
     },error=>{
       console.log(error)
       this.authStatusListner.next(false)
     })
    }
      login(email:string,password:string){
      const userData:AuthData={
        email:email,
        password:password
      }
      //console.log(email,password)
      this.http.post<{token:string,expiresIn:number,userId:string}>(url+'login',userData).subscribe((response)=>{
        this.token=response.token
        console.log("userId: "+response.userId)
        if(this.token)
        {    
          const expiresInDuration=response.expiresIn;
          console.log(expiresInDuration*1000)
          this.setAuthTimer(expiresInDuration)
          this.userId=response.userId
          this.isAuthenticated=true;
          const date= new Date()
          const expirationDate= new Date(date.getTime()+expiresInDuration*1000)
          console.log(typeof(expirationDate));
          this.saveAuthData(this.token,expirationDate,this.userId)
          this.authStatusListner.next(true);}
          this.router.navigate(['/'])
      },error=>{
        this.authStatusListner.next(false)
      })
    }
    autoAuthUser(){
      console.log("Im working")
      const authInfo=this.getAuthData()
      console.log("AuthInfo",authInfo)
      if(!authInfo){
        return;
      }
      const now = new Date()
      const expireIn=authInfo.expirationDate.getTime()-now.getTime()
      this.userId=authInfo.userId
      //console.log("check for auto auth",expireIn)
      if(expireIn>0){
        this.token=authInfo.token;
        this.isAuthenticated=true;
        this.setAuthTimer(expireIn/1000);
        this.authStatusListner.next(false)

      }
    }
    setAuthTimer(duration:number){
      this.tokentimer= setTimeout(()=>{this.logout()},duration*1000)
    }
    logout(){
      this.token=null;
      this.isAuthenticated=false;
      this.userId=null;
      this.authStatusListner.next(false)
      clearTimeout(this.tokentimer)
      this.clearAuthData()
      this.router.navigate(['/'])
    }
    saveAuthData(token:string,expirationDate:any,userId:string){
     console.log("saveAuthData",token,expirationDate)
     console.log("ISO",expirationDate)

      localStorage.setItem('token',token);
      localStorage.setItem('expiration',expirationDate)
      localStorage.setItem('userId',userId)
    }
    clearAuthData(){
      localStorage.removeItem("token");
      localStorage.removeItem("expiration")
      localStorage.removeItem('userId')
    }
    getAuthData(){
      const token=localStorage.getItem("token");
      const expirationDate=localStorage.getItem("expiration")
      const userId=localStorage.getItem('userId');
      console.log("getAuthData",token,expirationDate)
      if(!token||!expirationDate)
      {
        return
      }
      return {
        token:token,
        expirationDate:new Date(expirationDate),
        userId:userId
      }
    }
}
