import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormlyModule } from '@ngx-formly/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { SharedPrimengModule } from './shared/modules/shared-primeng/shared-primeng.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

// export function load_echarts() {
//   return import('echarts');
// }

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormlyModule.forRoot(),
    SharedPrimengModule,
    BrowserAnimationsModule,
    // NgxEchartsModule.forRoot({
    //   echarts: load_echarts
    // })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
