import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path:'', loadChildren:()=>import('./modules/demo/demo.module').then(mod => mod.DemoModule) },
  { path:'report', loadChildren:() =>import('./modules/report/report.module').then(mod => mod.ReportModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
