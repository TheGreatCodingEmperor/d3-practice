import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoRoutingModule } from './demo-routing.module';
import { HomeComponent } from './components/home/home.component';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { DrawLineComponent } from './components/draw-line/draw-line.component';

@NgModule({
  declarations: [
    HomeComponent,
    DrawLineComponent
  ],
  imports: [
    CommonModule,
    DemoRoutingModule,
    DragAndDropModule
  ]
})
export class DemoModule { }
