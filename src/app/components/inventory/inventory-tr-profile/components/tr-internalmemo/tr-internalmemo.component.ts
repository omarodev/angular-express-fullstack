import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tr-internalmemo',
  templateUrl: './tr-internalmemo.component.html',
  styleUrls: ['./tr-internalmemo.component.css']
})
export class TRInternalMemoComponent {

  @Output() memoChanged: EventEmitter<any> = new EventEmitter();
  @Input() internalMemo: any;
  onMemoChange(event) {
    this.memoChanged.emit(event.target.value);
  }
}
