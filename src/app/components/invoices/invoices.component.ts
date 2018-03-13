import { Component, OnInit } from '@angular/core';
import { CommonComponent } from '../common/common.component';
import { FilterService } from './filter.service';
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: [
    './invoices.component.css'
  ],
  entryComponents: [
    CommonComponent
  ],
  providers: [FilterService]
})
export class InvoicesComponent implements OnInit {

  menuCollapsed = true;
  saveFilterModalCollapsed = true;
  showSaveFilterModal = false;
  filterClicked = false;
  backUpInvoices: any;
  openSavedFiltersList = false;
  savedFiltersListCollapsed = true;
  savedFiltersArr = [];
  filterAvaliableTo: any;
  filterName = '';

  constructor( private filterService: FilterService ) {
    this.filterAvaliableTo = 'everyone';
  }


  public filters  = {
    createdFrom: '',
    createdTo: '',
    updatedFrom: '',
    updatedTo: '',
    selectTag: '',
    selectStatus: '',
  };

  public invoiceTags: Array<Object> = [
    'Home'
  ];

  public invoiceStatus: Array<string> = [
    'Place order', 'Below re-order point', 'No stock!', 'Active'
  ];

  public invoicesListInfo: Array<Object> = [
    {
      id: 0,
      imgUrl: 'assets/images/tie.png',
      invoiceName: 'Home Controller 800',
      modelNumber: 'Control4',
      brand: 'Control4',
      sku: 88021111,
      stock: 5,
      variant: 1,
      reorderPoint: 3,
      status: '',
      supplier: 'John Smith',
      createDate: 'Januanry 19, 2018',
      updatedDate: 'Januanry 25, 2018',
      tag: ['Home', 'Controller']
    },
    {
      id: 1,
      imgUrl: 'assets/images/tie.png',
      invoiceName: 'Home Controller 250',
      modelNumber: 'Control4',
      brand: 'Control4',
      sku: 88021112,
      stock: 2,
      variant: 1,
      reorderPoint: 3,
      status: '',
      supplier: 'Rob Harding',
      createDate: 'Januanry 19, 2018',
      updatedDate: 'Januanry 25, 2018',
      tag: ['Home']
    },
    {
      id: 2,
      imgUrl: 'assets/images/tie.png',
      invoiceName: 'Adaptive Phase Dimmer',
      modelNumber: 'Control4',
      brand: 'Control4',
      sku: 88021113,
      stock: 5,
      variant: 2,
      reorderPoint: 3,
      status: '',
      supplier: 'John Smith',
      createDate: 'Januanry 19, 2018',
      updatedDate: 'Januanry 25, 2018',
      tag: ['Adaptive', 'Dimmer', 'Home']
    },
    {
      id: 3,
      imgUrl: 'assets/images/tie.png',
      invoiceName: 'Low-Voltage Wired Keypad',
      modelNumber: 'Control4',
      brand: 'Control4',
      sku: 88021115,
      stock: -2,
      variant: 2,
      reorderPoint: 3,
      status: '',
      supplier: 'John Smith',
      createDate: 'Januanry 19, 2018',
      updatedDate: 'Januanry 25, 2018',
      tag: ['Keypad', 'Controller']
    },
    {
      id: 4,
      imgUrl: 'assets/images/tie.png',
      invoiceName: '55" Smart LED TV',
      modelNumber: 'Best Buy',
      brand: 'Samsung',
      sku: 88021117,
      stock: 3,
      variant: 2,
      reorderPoint: 0,
      status: '',
      supplier: 'John Smith',
      createDate: 'Januanry 19, 2018',
      updatedDate: 'Januanry 25, 2018',
      tag: ['TV', 'Samsung']
    },
    {
      id: 5,
      imgUrl: 'assets/images/tie.png',
      invoiceName: 'SPA Team Installation',
      modelNumber: 'Service',
      brand: 'No Automations',
      sku: 88020000,
      stock: 0,
      variant: 0,
      reorderPoint: 0,
      status: '',
      supplier: 'Diana Ilic',
      createDate: 'Januanry 19, 2018',
      updatedDate: 'Januanry 25, 2018',
      tag: ['Service'],
      type: 'Service'
    },
    {
      id: 6,
      imgUrl: 'assets/images/tie.png',
      invoiceName: '2 Year Warranty',
      modelNumber: 'Service',
      brand: 'No Automations',
      sku: 88020001,
      stock: 0,
      variant: 0,
      reorderPoint: 0,
      status: '',
      supplier: 'John Smith',
      createDate: 'Januanry 19, 2018',
      updatedDate: 'Januanry 25, 2018',
      tag: ['Service'],
      type: 'Non-Stockable'
    }
  ];

  public invoiceTypes = ['Individual', 'Business'];
  ngOnInit() {
    this.backUpInvoices = this.invoicesListInfo;
  }

  getFilter(event) {
    this.invoicesListInfo = event.filtered;
    this.filterClicked = event.clicked;
  }

  addNewInvoice(event) {
    this.invoicesListInfo.push(event.data);
  }

  toggleMenubar(data: boolean) {
    this.menuCollapsed  = data;
  }

  closeModal() {
    this.saveFilterModalCollapsed = true;
    this.showSaveFilterModal = false;
    this.filterClicked = false;
    this.invoicesListInfo = this.backUpInvoices;
  }

  cancelFilter() {
    this.filters = {
      createdFrom: '',
      createdTo: '',
      updatedFrom: '',
      updatedTo: '',
      selectTag: '',
      selectStatus: '',
    };
    this.filterClicked = false;
    this.invoicesListInfo = this.backUpInvoices;
  }

  clickSavedFilters() {
    this.openSavedFiltersList = true;
    this.savedFiltersListCollapsed = false;
  }

  onChangeAcailable(value) {
    this.filterAvaliableTo = value;
  }

  saveFilter() {
    // const savingFilterData = this.invoicesListInfo;
    // const savingFilterName = this.filterName;
    // const savingAvailability = this.filterAvaliableTo;
    this.savedFiltersArr.push({
                          savedFilter: this.invoicesListInfo,
                          savedFilterName: this.filterName,
                          savedAvailabilty: this.filterAvaliableTo
                        });
    this.saveFilterModalCollapsed = true;
    this.showSaveFilterModal = false;
    this.filterClicked = false;
    this.invoicesListInfo = this.backUpInvoices;
  }

  applySavedFilter(selectedFilter) {
    this.invoicesListInfo = selectedFilter.savedFilter;
    this.savedFiltersListCollapsed = true;
    this.openSavedFiltersList = false;
  }

  removeFilter() {
    this.invoicesListInfo = this.backUpInvoices;
    this.savedFiltersListCollapsed = true;
    this.openSavedFiltersList = false;
  }
}
