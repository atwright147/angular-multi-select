import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionDirective } from './selection.directive';
import { SelectionCheckboxDirective } from './selection-checkbox.directive';
import { SelectionItemDirective } from './selection-item.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionAllCheckboxDirective } from './select-all-checkbox.directive';

@NgModule({
  imports: [CommonModule, MatCheckboxModule],
  declarations: [
    SelectionCheckboxDirective,
    SelectionDirective,
    SelectionItemDirective,
    SelectionAllCheckboxDirective
  ],
  exports: [
    SelectionCheckboxDirective,
    SelectionDirective,
    SelectionItemDirective,
    SelectionAllCheckboxDirective
  ]
})
export class SelectionModule {}
