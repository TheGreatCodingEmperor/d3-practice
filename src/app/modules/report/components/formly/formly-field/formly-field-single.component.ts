import {
  Component, OnInit, EventEmitter, Input, Output, SimpleChanges, NgZone, OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms'; import { FormlyFieldConfig, FormlyFormBuilder } from '@ngx-formly/core';
import { FormlyValueChangeEvent } from '@ngx-formly/core/lib/components/formly.field.config';
import { Subscription } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

export function getFieldId(formId: string, options: FormlyFieldConfig, index: string | number) {
  if (options.id) return options.id;
  let type = options.type;
  if (!type && options.template) type = 'template';
  return [formId, type, options.key, index].join('_');
}

@Component({
  selector: 'formly-field-single',
  template: `
          <formly-field [field]="field" (modelChange)="changeModel($event)">
          </formly-field>
        `,
})
export class FormlyFieldSingleComponent implements OnInit, OnDestroy {
  @Input() model: any;
  @Input() form: FormGroup;
  @Input() field: FormlyFieldConfig;
  @Input() options: any = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter();

  private formControlListener: Subscription;

  constructor(private formlyBuilder: FormlyFormBuilder, private ngZone: NgZone) {
  }

  ngOnInit() {
    if (!this.form)
      return;
    this.field.id = uuidv4();;
    // this.formlyBuilder["formId"]++;
    // this.field.id = getFieldId(`formly_${this.formlyBuilder["formId"]}`, this.field, 0);
    // this.formlyBuilder["initFieldTemplateOptions"](this.field);
    // this.formlyBuilder["initFieldExpression"](this.field, this.model, this.options);

    // this.formlyBuilder["formlyConfig"].getMergedField(this.field);
    // this.formlyBuilder["initFieldValidation"](this.field);
    // this.formlyBuilder["initFieldAsyncValidation"](this.field);
    // this.formlyBuilder["addFormControl"](this.form, this.field, this.model || this.field.defaultValue || '');
    this.formlyBuilder.buildForm(this.form, [this.field], this.model, {});
    this.changeModel({field:this.field,type:this.field.type,value:null});
    this.formControlListener = this.field.formControl.valueChanges.subscribe(res => {
      this.changeModel({field:this.field,type:this.field.type,value:res});
    })
  }

  ngOnDestroy() {
    if (this.formControlListener)
      this.formControlListener.unsubscribe();
  }

  changeModel(event: FormlyValueChangeEvent) {
    this.modelChange.emit(event);
  }
}
