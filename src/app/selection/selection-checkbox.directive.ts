import { Directive, HostListener, Input, Host, OnInit, OnDestroy, OnChanges, Optional } from '@angular/core';
import { SelectionService } from './selection.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { Subject } from 'rxjs';
import { SelectionDirective } from './selection.directive';
import { compareFn } from './utils';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[dfSelectionCheckbox]'
})
export class SelectionCheckboxDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * Model to bind to this selection item.
   */
  @Input('dfSelectionCheckbox') model: any;

  private _destroy$ = new Subject();
  private _shiftKey = false;
  private _ctrlKey = false;

  constructor(
    @Optional() private _selection: SelectionDirective,
    @Host() private _checkbox: MatCheckbox,
    private _selectionService: SelectionService
  ) {}

  ngOnInit(): void {
    this._checkbox.change.subscribe(event =>
      this._selection.onToggleSelection(this.model, this._shiftKey, this._ctrlKey, false));

    this._selectionService.selections$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.checkSelected());
  }

  ngOnChanges(): void {
    this.checkSelected();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  checkSelected(): void {
    const current = this._selectionService.selections$.getValue();
    if (current) {
      this._checkbox.checked =
        current.find(s => compareFn(this._selectionService.trackBy, s, this.model)) !== undefined;
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: PointerEvent): void {
    event.preventDefault();
    this._shiftKey = event.shiftKey;
    this._ctrlKey = event.metaKey || event.ctrlKey;
  }

}
