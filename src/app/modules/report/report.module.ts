import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './components/report/report.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTypeComponent } from './components/formly/types/input/input-type.component';
import { SharedPrimengModule } from 'src/app/shared/modules/shared-primeng/shared-primeng.module';
import { FormlyFieldSingleComponent } from './components/formly/formly-field/formly-field-single.component';
import { ReportDesignerWrapperComponent } from './components/formly/wrapper/report-designer.wrapper';
import { RadioTypeComponent } from './components/formly/types/radio-type/radio-type.component';
import { EchartTypeComponent } from './components/formly/types/echart-type/echart-type.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

export function load_echarts() {
  return import('echarts');
}

@NgModule({
  declarations: [
    ReportComponent,
    InputTypeComponent,
    FormlyFieldSingleComponent,
    ReportDesignerWrapperComponent,
    RadioTypeComponent,
    EchartTypeComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts: load_echarts
    }),
    SharedPrimengModule,
    ReportRoutingModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'input',
          component: InputTypeComponent,
          wrappers: ['design-field'],
        },
        {
          name: 'radio',
          component: RadioTypeComponent,
          wrappers: ['design-field'],
        },
        {
          name: 'echart',
          component: EchartTypeComponent,
          wrappers: ['design-field'],
        },
      ],
      wrappers: [
        {
          name: 'design-field',
          component: ReportDesignerWrapperComponent,
        },
      ],
    }),
  ],
})
export class ReportModule {}
