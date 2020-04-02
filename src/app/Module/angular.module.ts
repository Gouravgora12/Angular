import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatInputModule} from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [

  ],exports:[
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ]
})
export class AngularModule { }
