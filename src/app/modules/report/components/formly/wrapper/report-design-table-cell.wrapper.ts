import { Component, OnDestroy, OnInit } from '@angular/core';
import { FieldWrapper, FormlyField, FormlyFieldConfig, FormlyFormBuilder } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { ReportDesignService } from '../../../services/report-design.service';

@Component({
    selector: 'exwo-designer-wrapper-panel',
    template: `
    <div (click)="setAttribute($event)">
      <label [attr.for]="id" *ngIf="to.label">
        {{ to.label }}
        <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
      </label>
      <div>
        <ng-template #fieldComponent></ng-template>
      </div>

      <div *ngIf="showError" class="invalid-feedback d-block">
        <formly-validation-message [field]="field" style="color:#B00020"></formly-validation-message>
      </div>
    </div>
  `,
})
export class ReportDesignTableCellWrapperComponent extends FieldWrapper implements OnInit,OnDestroy {
  settingPanelSubscription:Subscription;
  constructor(
    private reportDesignService:ReportDesignService,
    private builder:FormlyFormBuilder
  ){
    super();
  }

  ngOnInit(){
  }

  ngOnDestroy(){

  }

  setAttribute(event:MouseEvent){
    event.stopPropagation();
    this.reportDesignService.settingPannelToggle.next(this.field);
  }
}
