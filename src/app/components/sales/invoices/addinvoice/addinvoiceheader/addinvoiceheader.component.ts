import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-addinvoiceheader',
  templateUrl: './addinvoiceheader.component.html',
  styleUrls: ['./addinvoiceheader.component.css']
})
export default class AddInvoiceHeaderComponent implements OnInit {
  @Input() createdDate: string;
  @Input() dueDate: string;
  date_differ: number;

  ngOnInit() {
    const one_day = 1000 * 60 * 60 * 24;
    const createdDate_parts = this.createdDate.split('-');
    const mydate1 = new Date(parseInt(createdDate_parts[0]), parseInt(createdDate_parts[1]) - 1, parseInt(createdDate_parts[2])); 
    const date1_ms = mydate1.getTime();

    const dueDate_parts = this.dueDate.split('-');
    const mydate2 = new Date(parseInt(dueDate_parts[0]), parseInt(dueDate_parts[1]) - 1, parseInt(dueDate_parts[2])); 
    const date2_ms = mydate2.getTime();
    // Calculate the difference in milliseconds
    const difference_ms = date2_ms - date1_ms;
    this.date_differ = Math.round(difference_ms / one_day);
  }
}
