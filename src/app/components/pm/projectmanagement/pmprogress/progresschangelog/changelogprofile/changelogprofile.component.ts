import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectManagementService } from '../../../projectmanagement.service';
import * as moment from 'moment';
import { SharedService } from '../../../../../../services/shared.service';
import { ProjectsService } from '../../../../../../services/projects.service';
import { EstimatesService } from '../../../../../../services/estimates.service';

@Component({
  selector: 'app-changelogprofile',
  templateUrl: './changelogprofile.component.html',
  styleUrls: [
    './changelogprofile.component.css',
  ]
})

export class ChangeLogProfileComponent implements OnInit {
  changeLogInfo: any;

  changeLogList: any;
  showConfirmModal = false;
  descriptionChange: any;
  detailsChange: any;
  usersList = [];
  currentProjectId: any;
  currentChangeLogId: any;
  selectedContact: any;
  contactsList = [];
  title: string;
  changeLogStatus = 'IN_PROGRESS';
  createdEstimateId: any;
  estimatesList = [];
  estimateExist = false;

  constructor( private projectManagementService: ProjectManagementService, private router: Router, private sharedService: SharedService,
    private projectsService: ProjectsService, private route: ActivatedRoute, private estimatesService: EstimatesService ) {
      this.currentProjectId = localStorage.getItem('current_projectId');
      this.currentChangeLogId = this.route.snapshot.paramMap.get('id');
      this.projectsService.getIndividualProjectChangeLog(this.currentProjectId, this.currentChangeLogId).subscribe(res => {
        this.changeLogInfo = res.data;
        this.title = res.data.title;
        this.changeLogStatus = res.data.status;
        this.descriptionChange = res.data.description;
        this.detailsChange = res.data.newScopeOfWork;

        this.estimatesService.getEstimates().subscribe(estimate => {
          this.estimatesList = estimate.results;
          if (this.estimatesList.filter(e => e.changeLogId === this.changeLogInfo.id).length > 0) {
            this.estimateExist = true;
          }
        });
      });

      this.projectsService.getChangeLogItems(this.currentProjectId, this.currentChangeLogId).subscribe(res => {
        this.changeLogList = res.results;
      });

  }

  ngOnInit() {

  }

  confirm() {
    this.router.navigate(['./add-estimate']);
  }

  createEstimate() {
    if (this.estimateExist) {
      return;
    } else {
      const savingData = {
        changeLogId: this.changeLogInfo.id,
        shippingAddress: this.changeLogInfo.adress,
        contactId: this.changeLogInfo.contactId
      };
      this.estimatesService.createEstimate(savingData).subscribe(res => {
        console.log('created Estimate: ', res);
        this.createdEstimateId = res.data.id;
        this.router.navigate([`./estimate-profile/${this.createdEstimateId}`]);
      });
    }
  }

  addUserRealName(data) {
    data.forEach(element => {
      element.name = element.firstName + ' ' + element.lastName;
    });
    return data;
  }

  getCustomerNameFromUsername(username) {
    const selectedUser = this.usersList.filter(c => c.username === username)[0];
    return selectedUser.username;
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

  getContactNameFromId(id) {
    this.selectedContact = this.contactsList.filter(c => c.id === id)[0];
    return this.selectedContact.name;
  }

  onChangeTitle(event) {
    this.projectManagementService.logTitleChange.next(event);
  }

  onChangeStatus(event) {
    this.projectManagementService.logStatusChange.next(event);
  }

}
