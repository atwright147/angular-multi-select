import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { SelectionService } from './selection.service';
import { SelectionType } from './selection-type';

@Directive({
  selector: '[dfSelection]',
  providers: [SelectionService]
})
export class SelectionDirective {

  /**
   * The selection type; single or multi.
   */
  @Input('dfSelectionType')
  set selectionType(val: SelectionType) {
    this._selectionService.selectionType = val;
  }

  /**
   * The datasource to select from.
   */
  @Input('dfSelection')
  set datasource(val: any[]) {
    this._selectionService.datasource$.next(val);
  }

  /**
   * The current selections.
   */
  @Input('dfSelections')
  set selections(val: any[]) {
    this._selectionService.selections$.next(val);
  }

  /**
   * Track the selection by an id rather than object equality.
   */
  @Input('dfSelectionTrackBy')
  set selectionTrackBy(fn: (index: number, item: any) => any) {
    this._selectionService.trackBy = fn;
  }

  /**
   * Can an option be deselected.
   */
  @Input('dfSelectionDeselectable')
  set selectionDeselectable(val: boolean) {
    this._selectionService.deselectable = val;
  }

  /**
   * Selection disabled or not.
   */
  @Input('dfSelectionDisabled') selectionDisabled = false;

  /**
   * Event emitted when a selection was changed.
   */
  @Output() selectionsChange = new EventEmitter<{ selection?: any, selections: any[] }>();

  constructor(private _selectionService: SelectionService) {}

  /**
   * A child selection item was clicked.
   */
  onToggleSelection(model: any, shiftKey?: boolean, ctrlKey?: boolean, drag?: boolean): void {
    if (!this.selectionDisabled) {
      this._selectionService.toggle(model, shiftKey, ctrlKey, drag);
      this.selectionsChange.emit({
        selection: model,
        selections: this._selectionService.selections$.getValue()
      });
    }
  }

  /**
   * A child select all was selected.
   */
  onToggleAllSelection(): void {
    if (!this.selectionDisabled) {
      this._selectionService.toggleAll();
      this.selectionsChange.emit({
        selections: this._selectionService.selections$.getValue()
      });
    }
  }

}
