import {Component, forwardRef, HostBinding, Input, OnInit} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormGroupDirective,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {

  @HostBinding('attr.id')
  externalId = '';

  @Input('value')
  _inputValue: string = '';

  @Input()
  label!: string;

  @Input()
  type!: string;

  @Input()
  name!: string;

  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  constructor() {
  }

  get inputValue() {
    return this._inputValue;
  }

  set inputValue(val) {
    this._inputValue = val;
    this.onChange(this._inputValue);
    this.onTouched();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
    if (value) {
      this.inputValue = value;
    }
  }


}
