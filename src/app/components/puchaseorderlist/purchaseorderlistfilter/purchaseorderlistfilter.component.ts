import { Component, ChangeDetectorRef, Input, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { FilterService } from '../filter.service';
import { Ng2CompleterComponent } from '../../common/ng2completer/ng2completer.component';


@Component({
  selector: 'app-purchaseorderlistfilter',
  templateUrl: './purchaseorderlistfilter.component.html',
  styleUrls: [
    './purchaseorderlistfilter.component.css',
  ],
  providers: [FilterService]
})


export class PurchaseOrderListFilterComponent implements OnInit {

  @Input() purchaseOrdersInfo;
  @Input() filters;
  @Input() collaborators;
  @Input() purchaseorderStatus;
  @Input() purchaseorderTypes;
  @Output() filterParent: EventEmitter<any> = new EventEmitter;

  customersList = [];
  purchaseOrdersList = [];
  items2: any[] = [
    {id: 0, payload: {label: 'John Moss', imageUrl: 'assets/users/user1.png'}},
    {id: 1, payload: {label: 'Michael', imageUrl: 'assets/users/user2.png'}},
    {id: 2, payload: {label: 'Agile Smith', imageUrl: 'assets/users/user3.png'}},
    {id: 3, payload: {label: 'Joseph', imageUrl: 'assets/users/man.png'}},
  ];
  config2: any = {'placeholder': 'Type here', 'sourceField': ['payload', 'label']};

  public selectedMoment = new Date();
  public startedMin;
  public startedMax;
  public originFilters;
  startedDateFrom: Date;
  startedDateTo: Date;
  purchaseorderName: string;
  filteredPurchaseOrders: any;
  applyClicked = false;
  backUpPurchaseOrders: any;
  editable: boolean;
  newKeyword: string;
  selectedItem: any = '';
  inputChanged: any = '';
  selectCustomer =  '';
  selectProject = '';
  maxCompletion = 120;
  completionFrom = 0;
  completionTo = 120;
  selectStatus: string;

  constructor( private filterService: FilterService, private ref: ChangeDetectorRef ) {
    const comp = this;
    document.addEventListener('click', function() {
      comp.editable = false;
    });
  }

  ngOnInit() {
    this.filteredPurchaseOrders = this.purchaseOrdersInfo;
    this.backUpPurchaseOrders = this.purchaseOrdersInfo;
    this.originFilters = Object.assign({}, this.filters);

    // Get customer list from Information list and remove duplicated names
    const a = this.purchaseOrdersInfo.map(i => i.customerName);
    this.customersList = a.filter(function(item, pos) {
      return a.indexOf(item) === pos;
    });

    this.purchaseOrdersInfo.map(i => i.timePassed = this.calcTimePassedDays(i.signedDate, i.status));
    // Get work order list from Information list
    this. purchaseOrdersList = this.purchaseOrdersInfo.map( p => p.purchaseOrderNumber);

    this.completionFrom = this.filters.completionFrom ? this.filters.completionFrom : 0;
    this.completionTo = this.filters.completionTo ? this.filters.completionTo : 120;
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

  completionRangeSliderChange(event) {
    this.completionFrom = event.from;
    this.completionTo = event.to;
  }

  onSelectedCustomer(val) {
    this.filters.selectCustomer = val;
    this.selectCustomer = val;
  }

  onSelectedOrder(val) {
    this.filters.selectProject = val;
    this.selectProject = val;
  }

  onSelect(item: any) {
    this.selectedItem = item;
    this.items2 = this.items2.filter(function( obj ) {
      return obj.payload.label !== item.payload.label;
    });
    this.collaborators.push({name: item.payload.label, imageUrl: item.payload.imageUrl});
  }

  onInputChangedEvent(val: string) {
    this.inputChanged = val;
  }

  removeUser(i: number) {
    const item = this.collaborators[i];
    this.items2.push({id: this.items2.length, payload: {label: item.name, imageUrl: item.imageUrl}});
    this.collaborators.splice(i, 1);
  }

  selectStartedFrom(event) {
    this.startedDateFrom = event.value;
    this.startedMin = this.startedDateFrom;
  }

  selectStartedTo(event) {
    this.startedDateTo = event.value;
    this.startedMax = this.startedDateTo;
  }

  filterTxt (arr, searchKey) {
    return arr.filter(function(obj){
      return Object.keys(obj).some(function(key) {
        return obj[key].toString().includes(searchKey);
      });
    });
  }

  resetFilter() {
    this.selectCustomer = '';
    this.selectProject = '';
    this.completionFrom = 0;
    this.completionTo = 100;

    this.filters = {
      completionFrom : 0,
      completionTo : 100,
      startedFrom: '',
      startedTo: '',
      selectCustomer: '',
      selectProject: '',
      collaborators: '',
      purchaseorderName: '',
      startTimeFrom: 0,
      startTimeTo: 0,
      selectStatus: ''
    };
    this.ref.detectChanges();
  }

  applyFilter() {

    this.filters.completionFrom = this.completionFrom;
    this.filters.completionTo = this.completionTo;
    this.applyClicked = true;
    this.filteredPurchaseOrders = this.backUpPurchaseOrders;

    if (this.collaborators[0]) {
      let collaboratorFiltered = [];
      let collaboratorFilteredList = [];
      this.filteredPurchaseOrders.forEach(element => {
        for ( let i = 0; i <= this.collaborators.length - 1; i ++) {
          collaboratorFiltered = this.filterTxt(element.collaborators, this.collaborators[i].name);
          if (collaboratorFiltered.length > 0) {
            collaboratorFilteredList = collaboratorFilteredList.concat(element);
          }
        }
      });
      this.filteredPurchaseOrders = collaboratorFilteredList;
    }
    if (!this.completionFrom) { this.filters.completionFrom = 0; }
    if (!this.completionTo) { this.filters.completionTo = 100; }

    if (this.filters.startTimeFrom) {
      this.filteredPurchaseOrders = this.filteredPurchaseOrders.filter(purchaseorder => purchaseorder.scheduledStart >= this.filters.startTimeFrom);
    }
    if (this.filters.startTimeTo) {
      this.filteredPurchaseOrders = this.filteredPurchaseOrders.filter(purchaseorder => purchaseorder.scheduledStart <= this.filters.startTimeTo);
    }

    this.filteredPurchaseOrders = this.filteredPurchaseOrders.filter(purchaseorder =>
      purchaseorder.completion >= this.filters.completionFrom && purchaseorder.completion <= this.filters.completionTo);
    if (this.filters.selectCustomer) {
      this.filteredPurchaseOrders = this.filteredPurchaseOrders.filter(customer => customer.customerName === this.filters.selectCustomer);
    }

    if (this.filters.selectProject) {
      this.filteredPurchaseOrders = this.filteredPurchaseOrders.filter(project => project.purchaseOrderNumber === this.filters.selectProject);
    }

    if (this.filters.selectStatus) {
      this.filteredPurchaseOrders = this.filteredPurchaseOrders.filter(project => project.status === this.filters.selectStatus);
    }

    if (this.filters.startedFrom) {
      this.filteredPurchaseOrders = this.filteredPurchaseOrders.filter(
        purchaseorder => Date.parse(purchaseorder.startedDate) >= Number(this.filters.startedFrom)
      );
    }
    if (this.filters.startedTo) {
      this.filteredPurchaseOrders = this.filteredPurchaseOrders.filter(
        purchaseorder => Date.parse(purchaseorder.startedDate) <= Number(this.filters.startedTo)
      );
    }
    // remove duplicates from array
    this.filteredPurchaseOrders = Array.from(new Set(this.filteredPurchaseOrders));

    this.filterParent.emit({filtered: this.filteredPurchaseOrders, clicked: this.applyClicked});
  }
}