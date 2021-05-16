import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoRoutingModule } from './demo-routing.module';
import { HomeComponent } from './components/home/home.component';
import { DrawLineComponent } from './components/draw-line/draw-line.component';
import { DragDropComponent } from './components/drag-drop/drag-drop.component';
import { TableComponent } from './components/table/table.component';
import { ResizeComponent } from './components/resize/resize.component';
import { FlowComponent } from './components/flow/flow.component';
import { SharedPrimengModule } from 'src/app/shared/modules/shared-primeng/shared-primeng.module';

@NgModule({
  declarations: [
    HomeComponent,
    DrawLineComponent,
    DragDropComponent,
    TableComponent,
    ResizeComponent,
    FlowComponent
  ],
  imports: [
    CommonModule,
    DemoRoutingModule,
    SharedPrimengModule
  ]
})
export class DemoModule { }
