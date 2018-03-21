import { Component, OnInit } from '@angular/core';
import { CommonComponent } from '../common/common.component';
import { FilterService } from './filter.service';
@Component({
  selector: 'app-workorders',
  templateUrl: './workorders.component.html',
  styleUrls: [
    './workorders.component.css'
  ],
  entryComponents: [
    CommonComponent
  ],
  providers: [FilterService]
})
export class WorkOrdersComponent implements OnInit {

  menuCollapsed = true;
  saveFilterModalCollapsed = true;
  showSaveFilterModal = false;
  filterClicked = false;
  backUpWorkOrders: any;
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

  public collaborators: Array<string> = [
  ];

  public workorderStatus: Array<string> = [
    'Due', 'Overdue', 'Paid', 'Net 15', 'Net 30', 'Estimate', 'Approved', 'Rejected'
  ];

  public workOrdersInfo: Array<Object> = [
    {
      workOrderNumber: 'WO12345',
      workOrderName: 'Work Order Title Here',
      customerName: 'John Moss',
      startDate: 'November 20, 2017',
      scheduledStart: '8:00 AM',
      scheduledEnd: '6:30 PM',
      completion: 33,
      collaborators: [
        {
          name: 'John Moss',
          imgUrl: 'assets/users/user1.png'
        }
      ]
    },
    {
      workOrderNumber: 'WO12344',
      workOrderName: 'Work Order Title Here',
      customerName: 'John Moss',
      startDate: 'November 19, 2017',
      scheduledStart: '12:00 PM',
      scheduledEnd: '6:30 PM',
      completion: 64,
      collaborators: [
        {
          name: 'John Moss',
          imgUrl: 'assets/users/user1.png'
        },
        {
          name: 'Michael',
          imgUrl: 'assets/users/user2.png'
        }
      ]
    },
    {
      workOrderNumber: 'WO12343',
      workOrderName: 'Work Order Title Here',
      customerName: 'Agile Smith',
      startDate: 'November 18, 2017',
      scheduledStart: '8:00 AM',
      scheduledEnd: '11:00 AM',
      completion: 89,
      collaborators: [
        {
          name: 'John Moss',
          imgUrl: 'assets/users/user1.png'
        }
      ]
    },
    {
      workOrderNumber: 'WO12343',
      workOrderName: 'Work Order Title Here',
      customerName: 'Agile Smith',
      startDate: 'November 10, 2017',
      scheduledStart: '8:00 AM',
      scheduledEnd: '6:30 PM',
      completion: 59,
      collaborators: [
        {
          name: 'Agile Smith',
          imgUrl: 'assets/users/user3.png'
        }
      ]
    },
  ];

  ngOnInit() {
    this.backUpWorkOrders = this.workOrdersInfo;
  }

  getFilter(event) {
    this.workOrdersInfo = event.filtered;
    this.filterClicked = event.clicked;
  }

  addNewWorkOrder(event) {
    this.workOrdersInfo.push(event.data);
  }

  toggleMenubar(data: boolean) {
    this.menuCollapsed  = data;
  }

  closeModal() {
    this.saveFilterModalCollapsed = true;
    this.showSaveFilterModal = false;
    this.filterClicked = false;
    this.workOrdersInfo = this.backUpWorkOrders;
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
    this.workOrdersInfo = this.backUpWorkOrders;
  }

  clickSavedFilters() {
    this.openSavedFiltersList = true;
    this.savedFiltersListCollapsed = false;
  }

  onChangeAcailable(value) {
    this.filterAvaliableTo = value;
  }

  saveFilter() {
    // const savingFilterData = this.workOrdersInfo;
    // const savingFilterName = this.filterName;
    // const savingAvailability = this.filterAvaliableTo;
    this.savedFiltersArr.push({
                          savedFilter: this.workOrdersInfo,
                          savedFilterName: this.filterName,
                          savedAvailabilty: this.filterAvaliableTo
                        });
    this.saveFilterModalCollapsed = true;
    this.showSaveFilterModal = false;
    this.filterClicked = false;
    this.workOrdersInfo = this.backUpWorkOrders;
  }

  applySavedFilter(selectedFilter) {
    this.workOrdersInfo = selectedFilter.savedFilter;
    this.savedFiltersListCollapsed = true;
    this.openSavedFiltersList = false;
  }

  removeFilter() {
    this.workOrdersInfo = this.backUpWorkOrders;
    this.savedFiltersListCollapsed = true;
    this.openSavedFiltersList = false;
  }
}