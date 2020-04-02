import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms'
import { Post } from '../../../app.model'
import { PostsService } from '../../../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription}from 'rxjs'

import { mimeType } from './mime-type.validator'
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit,OnDestroy {
  private mode = 'create';
  private postID: string;
  public post: Post;
  form: FormGroup;
  isloading = false;
  imagePreview: string;
  private authStatusSub:Subscription
  constructor(public postService: PostsService, public route: ActivatedRoute,private authService:AuthService) { }
  ngOnInit(): void {
    this.authStatusSub=this.authService.getauthStatusListner().subscribe(authdata=>{
      this.isloading=false
    })
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required
          , Validators.minLength(3)]

      }),
      'Content': new FormControl(null, {
        validators: [Validators.required
          , Validators.minLength(3)]
      }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postID')) {
        this.mode = 'edit';
        this.postID = paramMap.get('postID');
        this.isloading = true
        this.postService.getPostE(this.postID).subscribe(postDataE => {
          this.isloading = false
          this.post = { _id: postDataE._id, title: postDataE.title, Content: postDataE.Content, imagePath: postDataE.imagePath,creator:postDataE.creator }
          this.form.setValue({ 'title': this.post.title, 'Content': this.post.Content, image:this.post.imagePath })
        })
        //console.log("my post da",this.post);
      }
      else {
        this.mode = 'create';
        this.postID = null;
      }
    })
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({ image: file })
    this.form.get('image').updateValueAndValidity()
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file)
  }
  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isloading = true;
    if (this.mode === 'create') { this.postService.addpost(this.form.value.title, this.form.value.Content, this.form.value.image) }
    else {
      this.postService.updatePost(
        this.postID,
        this.form.value.title,
        this.form.value.Content,
        this.form.value.image
      )
    }
    this.form.reset();
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe()
  }
}
