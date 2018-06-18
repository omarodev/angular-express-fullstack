import { Component, OnInit } from '@angular/core';
import { CommonComponent } from '../common/common.component';
import { SalesService } from './sales.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: [
    './sales.component.css'
  ],
  entryComponents: [
    CommonComponent
  ],
  providers: [SalesService]
})
export class SalesComponent implements OnInit {
  menuCollapsed = true;
  notProposalDetails = true;

  constructor( private router: Router) {
    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((val) => {
        console.log('router: ', val);
        if (val['url'].includes('/sales/proposal-details') ) {
          this.notProposalDetails = false;
        } else {
          this.notProposalDetails = true;
        }
      });
  }

  ngOnInit() {
  }

  toggleMenubar(data: boolean) {
    this.menuCollapsed  = data;
  }

}
