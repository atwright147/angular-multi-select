import { Directive, HostListener, Host, OnInit, Optional, OnDestroy, HostBinding, Input } from '@angular/core';
import { SelectionDirective } from './selection.directive';
import { SelectionService } from './selection.service';
import { Subscription, combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatCheckbox } from '@angular/material/checkbox';

@Directive({
  selector: '[dfSelectionAllCheckbox]'
})
export class SelectionAllCheckboxDirective implements OnInit, OnDestroy {

  private _subscription: Subscription;

  constructor(
    @Optional() private _selection: SelectionDirective,
    @Host() private _checkbox: MatCheckbox,
    private _selectionService: SelectionService
  ) {}

  ngOnInit() {
    this._subscription = combineLatest(this._selectionService.datasource$, this._selectionService.selections$)
      .subscribe(() => this.checkSelected());
  }

  ngOnChanges() {
    this.checkSelected();
  }

  checkSelected() {
    const current = this._selectionService.selections$.getValue();
    const all = this._selectionService.datasource$.getValue();
    if (current) {
      this._checkbox.checked = current.length === all.length;
      console.log('here', this._checkbox.checked)
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    this._selection.onToggleAllSelection();
  }

}
