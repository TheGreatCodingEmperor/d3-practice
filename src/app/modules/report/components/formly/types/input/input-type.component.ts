import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/core";

@Component({
  selector: 'input-type',
  templateUrl: './input-type.component.html',
  styleUrls: ['./input-type.component.css']
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTypeComponent extends FieldType {
  showPassword = false;
  isReport = false;
}
