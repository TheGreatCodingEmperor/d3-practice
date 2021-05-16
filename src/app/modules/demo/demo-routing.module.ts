import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DragDropComponent } from './components/drag-drop/drag-drop.component';
import { DrawLineComponent } from './components/draw-line/draw-line.component';
import { HomeComponent } from './components/home/home.component';
import { ResizeComponent } from './components/resize/resize.component';
import { TableComponent } from './components/table/table.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'line', component: DrawLineComponent },
  { path: 'drag-drop', component: DragDropComponent },
  { path: 'resize', component: ResizeComponent },
  { path: 'table', component: TableComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRoutingModule {}
