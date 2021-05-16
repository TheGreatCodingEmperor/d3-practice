import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportDesignService {
  /** @summary single formly 編輯畫面觸發 */
  settingPannelToggle = new BehaviorSubject<FormlyFieldConfig>(null);

  constructor() { }

  fieldTemplates=[
    {
      key: 'radio',
      name: 'radio',
      type: 'radio',
      templateOptions: {
        label: 'Email address',
        placeholder: 'Enter email',
        options: [
          { label: 'first', value: 1 },
          { label: 'second', value: true },
        ],
      },
    },
    {
      key: 'email',
      name:'input',
      type: 'input',
      templateOptions: {
        type: 'password',
        label: 'Email address',
        placeholder: 'Enter email',
        required: true,
      },
    },
    {
      key: 'echart',
      name: 'echart',
      type: 'echart',
      templateOptions: {
        label: 'Email address',
        chartOptions:{
          animation: false,
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
            },
          ],
        }
      },
    },
  ];
}
