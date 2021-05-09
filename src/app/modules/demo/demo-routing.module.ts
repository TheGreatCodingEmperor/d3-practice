import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawLineComponent } from './components/draw-line/draw-line.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'line', component: DrawLineComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRoutingModule {}
