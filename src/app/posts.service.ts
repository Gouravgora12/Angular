import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';
import { Router } from '@angular/router'
import { Post } from './app.model';
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { environment } from '../environments/environment'
const url = environment.apiUrl+'posts/';
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  postCount:number;
  private postUpdated = new Subject<{post:Post[],postCounter:number}>();
  constructor(private http: HttpClient, private router: Router) { }
  getPost(postPerPage:number,currentPage:number) {
    const queryParams=`?pageSize=${postPerPage}&page=${currentPage}`
    this.http.get<{message:string,post:any,maxPost:number}>(url+queryParams).subscribe((response) => {
      this.posts = response.post,
      this.postCount=response.maxPost
     //console.log("Post counted Data",this.postCount)
    // console.log("Post Data",response.userId)
      this.postUpdated.next({post:[...this.posts],postCounter:this.postCount});
    })
  }
  getUpdatedListner() {
    return this.postUpdated.asObservable();
  }
  getPostE(id: String) {
    //console.log("mera id",id);
    return this.http.get<Post>(url + id);
    //return {...this.posts.find((p)=>p._id===id)}
  }
  addpost(title: string, Content: string, image: File) {

    const postData = new FormData();
    postData.append('title', title);
    postData.append('Content', Content);
    postData.append('image', image, title)
    console.log("my data",postData)
    this.http.post<{ post: any }>(url, postData).subscribe((responseData) => {
      //console.log(responseData)
      // const post: Post = { _id: responseData.post.id, title: title, Content: Content, imagePath: responseData.post.imagePath }//
      // this.posts.push(post)
      // this.postUpdated.next([...this.posts]);
      this.router.navigate(['/'])
    })
  }
  deletePost(postID: String) {
    console.log(this.http.delete(url + postID))
    return this.http.delete(url + postID)
    // subscribe(() => {
    //   const updatedPost = this.posts.filter(post => post._id !== postID)
    //   this.posts = updatedPost;
    //   this.postUpdated.next([...this.posts])
    //})
  }
  updatePost(_id: string, title: string, Content: string, imagePath: any) {
    console.log("image",typeof(imagePath))
   let upostData:any
    if (typeof(imagePath)==='object')
    {
      upostData = new FormData();
      upostData.append('_id',_id)
      upostData.append('title', title);
      upostData.append('Content', Content);
      upostData.append('image', imagePath, title)
    }
    else { 
          upostData={ _id: _id, title: title, Content: Content, image: imagePath,creator:null }; 
        }
    //console.log("mypost to edit", post)
    console.log("Data to Update",upostData)
    this.http
      .put(url + _id, upostData)
      .subscribe(response => {
        console.log(response)
        // console.log(this.posts);
        // const updatedposts = [...this.posts];
        // const oldPostIndex = updatedposts.findIndex(p => p._id == _id)
        // const post:Post= { _id: _id, title: title, Content: Content, imagePath: "response.imagePath" }; 
        // updatedposts[oldPostIndex] = post;
        // this.posts = updatedposts;
        // this.postUpdated.next([...this.posts])
        this.router.navigate(['/'])
      });
  }
}