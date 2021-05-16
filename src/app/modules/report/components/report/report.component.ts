import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyValueChangeEvent } from '@ngx-formly/core/lib/components/formly.field.config';
import { Subscription } from 'rxjs';
import { ReportDesignService } from '../../services/report-design.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit, OnDestroy {
  settingPanelDisplay = false;

  form = new FormGroup({});
  model = { email: 'email@gmail.com' };

  fields: FormlyFieldConfig[] = [
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

  settingPanelSubscription: Subscription;

  constructor(private reportDesignService: ReportDesignService) {}

  ngOnInit() {
    this.settingPanelSubscription =
      this.reportDesignService.settingPannelToggle.subscribe(
        (field: FormlyFieldConfig) => {
          this.settingPanelDisplay = true;
        }
      );
  }

  ngOnDestroy() {}

  changeModels(event: FormlyValueChangeEvent) {
    this.model[event.field.key as string] = event.value;
  }

  submit(model) {
    console.log(model);
  }
  showSchema() {
    console.log(this.fields);
    console.log(this.form);
  }
}
