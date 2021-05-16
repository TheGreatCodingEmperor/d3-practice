import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-radio-type',
  templateUrl: './radio-type.component.html',
  styleUrls: ['./radio-type.component.css']
})
export class RadioTypeComponent extends FieldType implements OnInit {
  defaultOptions = {
    templateOptions: { options: [] },
  };

  constructor() {
    super();
   }

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe(e => {
      this.formControl.setValue(e, { emitEvent: false });
      console.log("change");
      console.log(this.formControl);
    });
  }

}
