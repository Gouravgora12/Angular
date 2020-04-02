import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PostCreateComponent} from './posts/post-create/post-create/post-create.component';
import {PostListComponent} from './post-list/post-list/post-list.component'
import { AuthGuard } from './auth/auth.guard';
import { AuthRouteModule} from './auth/auth-route.module'
import { from } from 'rxjs';
const routes: Routes = [
  {path:'',component:PostListComponent},
  {path:'create',component:PostCreateComponent,canActivate:[AuthGuard]},
  {path:'edit/:postID',component:PostCreateComponent,canActivate:[AuthGuard]},
  {path:'auth',loadChildren:"./auth/auth-route.module#AuthRouteModule"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
