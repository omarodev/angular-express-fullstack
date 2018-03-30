import { Component, Input, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from '../filter.service';
import * as _ from 'lodash';
import { HorizontalBarComponent } from '../../common/horizontalbar/horizontalbar.component';

@Component({
  selector: 'app-purchaseorderlisttable',
  templateUrl: './purchaseorderlisttable.component.html',
  styleUrls: [
    './purchaseorderlisttable.component.css',
  ],
  providers: [FilterService],
})


export class PurchaseOrderListTableComponent implements OnInit {

  @Input() purchaseOrdersInfo;
  public barInfo: any;
  sortClicked = true;
  clicked = false;
  sortScoreClicked = true;

  constructor( private filterService: FilterService, private router: Router ) {
  }

  ngOnInit() {
    this.purchaseOrdersInfo.map(i => i.barInfo = {
      title: i.completion + '%',
      completeness: i.completion
    });
  }

  getStatus() {
  }

  redirectTo(id) {
    this.router.navigate(['../purchaseorder/' + id]);
  }

  sortArray(field) {
    const cmp = this;
    cmp.sortScoreClicked = ! cmp.sortScoreClicked;
    if (!cmp.sortScoreClicked) {
      this.purchaseOrdersInfo.sort( function(name1, name2) {
        if ( name1[field] < name2[field] ) {
          return -1;
        } else if ( name1[field] > name2[field]) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      this.purchaseOrdersInfo.reverse();
    }
  }

  calcTimePassedDays(sign, status) {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const signDate = new Date(sign);
    const diffDays = Math.round((today.getTime() - signDate.getTime()) / (oneDay));
    if (diffDays < 0) {
      return 0;
    } else {
      return diffDays;
    }
  }

  sortStarteDateArray(field) {
    const cmp = this;
    cmp.sortScoreClicked = ! cmp.sortScoreClicked;
    if (!cmp.sortScoreClicked) {
      this.purchaseOrdersInfo.sort( function(name1, name2) {
        if ( Date.parse(name1[field]) < Date.parse(name2[field]) ) {
          return -1;
        } else if ( Date.parse(name1[field]) > Date.parse(name2[field])) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      this.purchaseOrdersInfo.reverse();
    }
  }

  getDateColor(days) {
    return days <= 6 ? 'green' : days <= 14 ? 'orange' : 'red';
  }

}
