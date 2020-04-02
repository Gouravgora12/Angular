import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription}from 'rxjs'
import {Post} from '../../app.model'
import {PostsService} from '../../posts.service'
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service'
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts:Post[]=[];
  isloading=false;
  private postSub:Subscription;
  private authStatusSub:Subscription
  totalPosts=0
  currentPage=1
  postsPerPage=10
  pageSizeOptions=[1,3,5,10];
  userIsAuthenticated=false
  userId:string
  constructor(public postService:PostsService,private AuthService:AuthService) { }
  ngOnInit(): void {
    this.isloading=true;
    this.postService.getPost(this.postsPerPage,this.currentPage);
    this.userId=this.AuthService.getUserId();
    console.log("userId 1",this.AuthService.getUserId())
   this.postSub= this.postService.getUpdatedListner()
    .subscribe((postData:{post:Post[],postCounter:number})=>{
      this.isloading=false;
          this.posts=postData.post
          this.totalPosts=postData.postCounter;
    });
    this.userIsAuthenticated=this.AuthService.getIsAuth()
    this.authStatusSub=this.AuthService.getauthStatusListner().subscribe(isAuthenticated=>{
      this.userIsAuthenticated=isAuthenticated
      console.log("userID",this.AuthService.getUserId())
      this.userId=this.AuthService.getUserId();
    })
  }
  onChangedPage(pageData:PageEvent){
    this.isloading=true;
    this.currentPage=pageData.pageIndex+1;
    this.postsPerPage=pageData.pageSize
    this.postService.getPost(this.postsPerPage,this.currentPage);
    console.log("Page Data", pageData)
  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
  }
  OnDelete(postID:String){
    this.isloading=true;
    this.postService.deletePost(postID).subscribe(()=>{
      this.postService.getPost(this.postsPerPage,this.currentPage)
    },()=>{
      this.isloading=false
    })
    this.authStatusSub.unsubscribe()
  }
}
