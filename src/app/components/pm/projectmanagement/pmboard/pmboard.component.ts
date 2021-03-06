import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectManagementService } from '../projectmanagement.service';
import { PmTasksService } from '../../../../services/pmtasks.service';
import * as moment from 'moment';
import { SharedService } from '../../../../services/shared.service';
import { ProjectsService } from '../../../../services/projects.service';

@Component({
  selector: 'app-pmboard',
  templateUrl: './pmboard.component.html',
  styleUrls: [
    './pmboard.component.css',
  ]
})

export class PmBoardComponent implements OnInit {

  menuCollapsed: any;
  public tasks = [];
  links = [

  ];
  public barInfo: any;

  public taskOwners = [];

  // public projectInfo = {
  //   projectOwner: {
  //     name: 'John Moss',
  //     imgUrl: 'assets/users/user1.png',
  //   },
  //   projectId: 'NU8802-0159',
  //   startDate: '2016-12-5',
  //   targetDate: '',
  //   nextPaymentDate: '',
  //   budgetPerformance: 54,
  //   schedulePerformance: 51,
  //   roiPerformance: 67,
  //   projectHealth: 33,
  //   projectTasks: {
  //     totalTasks: 25,
  //     overdue: 1,
  //     completed: 4
  //   },
  //   projectProgress: {
  //     qualityPerformance: 93,
  //     scopePerformance: 58,
  //     scopeChange: 3,
  //     mitigation: 3,
  //   },
  //   inventoryHealth: {
  //     notProcessed: 0,
  //     onOrder: 1,
  //     checkedIn: 33,
  //     delivered: 0
  //   },
  //   projectBudget: 12566.37,
  //   budgetUsed: 6749,
  //   revenue: 11164,
  //   labor: 0,
  // };
  public projectInfo: any;

  public pmBoardTableData = [];

  public financialTableData = [
    {
      type: 'Invoice',
      typeNumber: 'IN 123399',
      total: 11164.84,
      status: 'Paid',
      dateCreated: 'December 20, 2016',
      dateUpdated: 'December 20, 2016',
      collaborators: [
        {
          name: 'John Moss',
          imgUrl: 'assets/users/user1.png'
        }
      ]
    },
    {
      type: 'Purchase Order',
      typeNumber: 'PO 88031233',
      total: 6749,
      status: 'Parcial Fulfillment',
      dateCreated: 'December 15, 2016',
      dateUpdated: 'December 15, 2016',
      collaborators: [
        {
          name: 'John Moss',
          imgUrl: 'assets/users/user1.png'
        }
      ]
    },
  ];

  public timelineData: Array<Object> = [
    {
      title: 'Meeting',
      icon: 'fa-home',
      content: 'Conference on the sales for the previous year.\
       Monica please examine sales trends in marketing and products. Below please find the currnet status of the sale',
      timelineBtnColor: 'green-btn',
      buttontitle: 'More Info',
      date: '2018-1-9',
      buttonClickEventHandlerName: 'getMoreInfo'
    },
    {
      title: 'Send Document to Mike',
      icon: 'fa-file-text-o',
      content: 'Conference on the sales for the previous year.\
       Monica please examine sales trends in marketing and products. Below please find the currnet status of the sale',
      timelineBtnColor: 'blue-btn',
      buttontitle: 'Download document',
      date: '2018-1-9',
      buttonClickEventHandlerName: 'downloadDoc'
    },
    {
      title: 'Coffee Break',
      icon: 'fa-coffee',
      content: 'Conference on the sales for the previous year.\
       Monica please examine sales trends in marketing and products. Below please find the currnet status of the sale',
      timelineBtnColor: 'lime-btn',
      buttontitle: 'Read more',
      date: '2018-1-8',
      buttonClickEventHandlerName: 'readMoreCoffee'
    },
    {
      title: 'Phone with Jeronimo',
      icon: 'fa-phone',
      content: 'Following step to complete',
      timelineBtnColor: 'orange-btn',
      buttontitle: 'Download doc',
      date: '2018-1-7',
      buttonClickEventHandlerName: 'downloadDoc'
    }
  ];
  usersList = [];
  tasksTemp = [];
  currentProjectId: any;
  contactsList = [];
  selectedContact: any;

  constructor(private sharedService: SharedService, private pmService: ProjectManagementService,  private pmTasksService: PmTasksService,
    private projectsService: ProjectsService ) {
    this.sharedService.getUsers().subscribe(users => {
      this.usersList = users;
      this.taskOwners = users;
    });

    this.currentProjectId = localStorage.getItem('current_projectId');
    if (this.currentProjectId !== '') {

      this.projectsService.getIndividualProject(this.currentProjectId).subscribe(res => {
        console.log('Individual project: ', res);
        this.projectInfo = res.data;
        this.sharedService.getMulipleContacts(this.projectInfo.contactId).subscribe(data => {
          this.selectedContact = data[0];
          this.projectInfo.contactName = this.getContactNameFromId(this.selectedContact);
        });
        this.barInfo = {
          title: 'Project health is at ' + this.projectInfo.health + '%',
          completeness: this.projectInfo.health,
        };
      });
    } else {
      console.error('product id error');
    }

    this.getPmBoardTableData();
  }

  ngOnInit() {

  }

  getPmBoardTableData() {
    this.tasksTemp = [];
    this.pmTasksService.getTaskGroupsWithParams({projectId: this.currentProjectId}).subscribe(data => {
      this.pmBoardTableData = data.results;
      for (let i = 0; i < this.pmBoardTableData.length; i++) {
        this.pmBoardTableData[i].color = '';

        if (this.pmBoardTableData[i].taskIds !== null) {
            this.pmTasksService.getTasks(this.pmBoardTableData[i].id).subscribe(taskData => {
              this.pmBoardTableData[i].tasks = taskData.results;
              this.pmBoardTableData[i].tasks.forEach(element => {
                element.assigneeInfo = this.getUserInfo(element.assignee);
                element.startDate = moment(element.startDate).format('YYYY-MM-DD');
                element.dueDate = moment(element.startDate).add(element.duration, 'days').format('YYYY-MM-DD');
                element.taskTitle = element.title;
                element.dependency = element.dependencyIds ? element.dependencyIds : [];
              });
              this.addTasksFromPmBoardData(this.pmBoardTableData[i], i);
            });
        }
      }
      console.log('pmBoardTableData: ', this.pmBoardTableData);
    });
  }

  getUserInfo(username) {
    const selectedUser = this.usersList.filter(u => u.username === username)[0];
    return selectedUser;
  }
  addTasksFromPmBoardData(tableDataAtIndex: any, i) {
      const midTk = {
        id: tableDataAtIndex.id,
        title: tableDataAtIndex.title,
        start_date: this.minDate(tableDataAtIndex.tasks.map(t => t.startDate)),
        end_date: this.maxDate(tableDataAtIndex.tasks.map(t => t.dueDate)),
        progress: tableDataAtIndex.completion / 100
      };
      this.tasksTemp.push(midTk);

      if (this.tasksTemp.length === this.pmBoardTableData.length) {
        this.tasks = this.sortById(this.tasksTemp);
      }
  }

  sortById(arr) {
    return arr.sort((a, b) => a.id - b.id);
  }

  getUpdatedPmData(eventData) {
    this.getPmBoardTableData();
  }

  toggleMenubar(data: boolean) {
    this.menuCollapsed  = data;
  }

  minDate(arr) {
    let min = arr[0];
    arr.forEach(element => {
      if (Date.parse(element) < Date.parse(min)) {
        min = element;
      }
    });
    return min;
  }

  maxDate(arr) {
    let max = arr[0];
    arr.forEach(element => {
      if (Date.parse(element) > Date.parse(max)) {
        max = element;
      }
    });
    return max;
  }

  getMilestoneProgress(arr) {
    let progressSum = 0;
    arr.forEach(element => {
      progressSum += element.completion;
    });
    return progressSum / (arr.length * 100);
  }

  addContactName(data) {
    data.forEach(element => {
      if (element.type === 'PERSON') {
        element.name = element.person.firstName + ' ' + element.person.lastName;
      } else {
        element.name = element.business.name;
      }
    });
    return data;
  }

  getContactNameFromId(selectedContact) {
    if (selectedContact.type === 'PERSON') {
      selectedContact.name = selectedContact.person.firstName + ' ' + selectedContact.person.lastName;
    } else {
      selectedContact.name = selectedContact.business.name;
    }
    return selectedContact.name;
  }
}
