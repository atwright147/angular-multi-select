import { Directive, HostBinding, HostListener, Input, OnInit, Optional, OnChanges, OnDestroy } from '@angular/core';
import { SelectionService } from './selection.service';
import { Subscription, Subject } from 'rxjs';
import { SelectionDirective } from './selection.directive';
import { compareFn } from './utils';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[dfSelectionItem]',
  host: {
    '[class.selection-enabled]': '!disabled',
    '[class.selection-selected]': 'selected'
  }
})
export class SelectionItemDirective implements OnInit, OnChanges, OnDestroy {

  /**
   * Model that is bound to this selection.
   */
  @Input('dfSelectionItem') model: any;

  /**
   * Selection of the item is disabled.
   */
  @Input('dfSelectionDisabled') disabled = false;

  /**
   * Whether the item is selected or not.
   */
  @Input() selected = false;

  private _destroy$ = new Subject();

  constructor(
    @Optional() private _selection: SelectionDirective,
    private _selectionService: SelectionService
  ) {}

  ngOnInit() {
    this.checkSelected();

    this._selectionService.selections$
      .pipe(takeUntil(this._destroy$))
      .subscribe(selections => this.checkSelected());
  }

  ngOnChanges() {
    this.checkSelected();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  checkSelected() {
    const current = this._selectionService.selections$.getValue();
    if (current) {
      this.selected = current.find(s => compareFn(this._selectionService.trackBy, s, this.model)) !== undefined;
    }
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    if (!this.disabled) {
      this._selection.onToggleSelection(this.model, event.shiftKey, event.metaKey || event.ctrlKey, false);
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event) {
    if (!this.disabled) {
      this._selection.onToggleSelection(this.model, false, false, true);
    }
  }

  @HostListener('dragStart')
  onDrag() {
    if (!this.disabled) {
      this._selection.onToggleSelection(this.model, false, false, true);
    }
  }

}
