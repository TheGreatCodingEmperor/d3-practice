import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
} from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { EChartsOption } from 'echarts';
import * as d3 from 'd3';

@Component({
  selector: 'app-echart-type',
  templateUrl: './echart-type.component.html',
  styleUrls: ['./echart-type.component.css'],
})
export class EchartTypeComponent
  extends FieldType
  implements AfterViewInit, OnChanges
{
  defaultOptions = {
    templateOptions: { options: [] },
    chartOptions: {} as EChartsOption,
  };

  constructor(private el: ElementRef) {
    super();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges() {
  }

  changeValue(){
    console.log('changeValue');
    var baseCanvas = (this.el.nativeElement as HTMLElement).querySelector(
      'canvas'
    );
    this.formControl.setValue(baseCanvas.toDataURL());
  }
}
