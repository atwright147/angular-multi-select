import { Injectable } from '@angular/core';
import { SelectionType } from './selection-type';
import { compareFn } from './utils';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SelectionService {

  selectionType = SelectionType.multi;
  datasource$ = new BehaviorSubject([]);
  selections$ = new BehaviorSubject([]);
  trackBy: (index: number, item: any) => any;
  deselectable: boolean;

  private _prevIndex: number;

  /**
   * Select the passed model if its not already selected.
   */
  select(model: any): void {
    const datasource = this.datasource$.getValue();
    const idx = datasource.findIndex(sel => compareFn(this.trackBy, sel, model));
    const current = this.selections$.getValue();
    this._prevIndex = idx;

    const selection = current.find(sel => compareFn(this.trackBy, sel, model));
    if (!selection) {
      this.selections$.next([...current, model]);
    }
  }

  /**
   * Deselect the passed model if already selected.
   */
  deselect(model: any): void {
    const datasource = this.datasource$.getValue();
    const idx = datasource.findIndex(sel => compareFn(this.trackBy, sel, model));
    const current = this.selections$.getValue();
    this._prevIndex = idx;

    const selectionIdx = current.findIndex(sel => compareFn(this.trackBy, sel, model));
    if (selectionIdx > -1) {
      const selections = [...current];
      selections.splice(selectionIdx, 1);
      this.selections$.next(selections);
    }
  }

  /**
   * Toggle the selection of the model. If shift key passed, select a range.
   */
  toggle(model: any, shiftKey: boolean, ctrlKey: boolean, drag: boolean): void {
    const current = this.selections$.getValue();
    const canSelectMultiSelect =
      (this.selectionType === SelectionType.multi && ctrlKey) ||
      (this.selectionType === SelectionType.multiClick);

    if (shiftKey && this.selectionType !== SelectionType.single) {
      const datasource = this.datasource$.getValue();
      const idx = datasource.findIndex(sel => compareFn(this.trackBy, sel, model));
      if (idx > -1) {
        this.selectBetween(idx, this._prevIndex);
      }
    } else if (canSelectMultiSelect) {
      const selection = current.find(sel => compareFn(this.trackBy, sel, model));

      if (!selection) {
        this.select(model);
      } else if (this.deselectable) {
        this.deselect(model);
      }
    } else if (drag) {
      const selection = current.find(sel => compareFn(this.trackBy, sel, model));
      // If we are dragging and the item selected isn't selected, lets deselect
      // the other options and select this one.
      if (this.selectionType === SelectionType.multi && !selection) {
        this.selections$.next([]);
        this.select(model);
      }
    } else {
      const selection = current.find(sel => compareFn(this.trackBy, sel, model));

      if (this.selectionType === SelectionType.multi && selection) {
        // If there is more than one selection, then deselect others and select this one
        if (current.length !== 1) {
          this.selections$.next([]);
          this.select(model);
        }
        return;
      }

      if (selection) {
        this.selections$.next([model]);
        this.deselect(model);
      } else {
        this.selections$.next([]);
        this.select(model);
      }
    }
  }

  /**
   * Toggle all items in the datasource selected or not.
   */
  toggleAll(): void {
    const current = this.selections$.getValue();
    const datasource = this.datasource$.getValue();

    if (current.length === datasource.length) {
      this.selections$.next([]);
    } else {
      this.selections$.next([...datasource]);
    }
  }

  /**
   * Select a range between the provided indexes.
   */
  private selectBetween(index: number, prevIndex: number): void {
    const datasource = this.datasource$.getValue();
    const current = this.selections$.getValue();

    // On init we don't have a previous index, find it based on the first selection
    if (prevIndex === undefined && current.length) {
      const [selection] = current;
      const idx = datasource.findIndex(sel => compareFn(this.trackBy, sel, selection));
      this._prevIndex = prevIndex = idx;
    }

    const reverse = index < prevIndex;
    const start = reverse ? index : prevIndex;
    const end = reverse ? prevIndex : index;

    for (let i = start; i <= end; i++) {
      this.select(datasource[i]);
    }
  }

}
