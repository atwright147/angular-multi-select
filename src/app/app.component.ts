import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: 'multi-select';

  items = [
    { name: 'One', value: 1 },
    { name: 'Two', value: 2 },
    { name: 'Three', value: 3 },
    { name: 'Four', value: 4 },
    { name: 'Five', value: 5 }
  ];

  selections = [{ name: 'One', value: 1 }];

  trackByFn(index, item): number {
    return item.value;
  }

  onSelectionChange({ selection, selections }): void {
    this.selections = [...selections];
  }
}
