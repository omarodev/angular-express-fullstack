import { Component, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectManagementService } from '../../../projectmanagement.service';
import { SharedService } from '../../../../../../services/shared.service';
import { ProjectsService } from '../../../../../../services/projects.service';
import * as moment from 'moment';
import { CommonService } from '../../../../../common/common.service';

@Component({
  selector: 'app-changelogdetails',
  templateUrl: './changelogdetails.component.html',
  styleUrls: [
    './changelogdetails.component.css'
  ]
})
export class ChangeLogDetailsComponent implements OnInit, OnDestroy {

  @Input() set descriptionChange(val) {
    this._descriptionChange = val;
  }
  @Input() set detailsChange (val) {
    this._detailsChange = val;
  }
  changeLogInfo: any;
  switchIconAddress = false;
  switchIconPm = false;
  address = '';
  city = '';
  province = '';
  country = '';
  postalCode = '';
  public endMin;
  public startMax;
  contactsList = [];
  usersList = [];
  customerName = '';
  currentProjectId = '';
  logId = '';
  requestedBy = '';
  ccContact: any;
  createdAt: any;
  updatedAt: any;
  updatePm = false;
  projectInfo: any;
  projectName = '';
  selectedContact; any;
  createdChangeLog: any;
  title = '';
  logStatus = 'IN_PROGRESS';
  currentChangeLogId: any;
  _descriptionChange: any;
  _detailsChange: any;
  modalContent = 'Cannot update Approved or Rejected Change log';

  constructor( private projectManagementService: ProjectManagementService, private sharedService: SharedService,
    private projectsService: ProjectsService, private route: ActivatedRoute, private commonService: CommonService, private router: Router) {
    this.currentProjectId = localStorage.getItem('current_projectId');
    this.currentChangeLogId = this.route.snapshot.paramMap.get('id');

    this.projectsService.getIndividualProjectChangeLog(this.currentProjectId, this.currentChangeLogId).subscribe(res => {
      this.createdChangeLog = res.data;
      this.ccContact = res.data.additionalContactId;
      this.title = res.data.title;
      this.logStatus = res.data.status;
      this.switchIconPm = res.data.updateProjectManager;
      if ( this.createdChangeLog.status === 'APPROVED' || this.createdChangeLog.status  === 'REJECTED') {
        this.commonService.showAlertModal.next(true);
      }
    });

    this.sharedService.getContacts().subscribe(res => {
      this.contactsList = res;
      this.contactsList = this.addContactName(this.contactsList);
    });

    const savingMockData = {
      title: '',
      description: '',
      newScopeOfWork: ''
    };

    this.projectManagementService.saveChangeLog.subscribe(data => {
      if (data['saveClicked']) {
        if ( this.createdChangeLog.status === 'APPROVED' || this.createdChangeLog.status  === 'REJECTED') {
          this.commonService.showAlertModal.next(true);
        } else {
          let savingData = {
            'additionalContactId': this.ccContact ? this.ccContact : this.createdChangeLog.contactId,
            'title': this.title,
            'useContactAddress': this.switchIconAddress,
            'updateProjectManager': this.switchIconPm,
            'description': this._descriptionChange ? this._descriptionChange : this.createdChangeLog.description,
            'newScopeOfWork': this._detailsChange ? this._detailsChange : this.createdChangeLog.newScopeOfWork,
            'status': this.logStatus
          };

          // savingData.keys(obj).forEach(k => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
          savingData = JSON.parse(JSON.stringify(savingData));
          this.currentProjectId = localStorage.getItem('current_projectId');
          this.currentChangeLogId = this.route.snapshot.paramMap.get('id');
          this.projectsService.updateIndividualChangeLog(this.currentProjectId, this.createdChangeLog.id, savingData)
            .subscribe(res => {
              data['saveClicked'] = false;
            });
          this.router.navigate(['./pm/pm-details/pm-progress/pm-logs-table/']);
        }
      }
    });

    this.projectManagementService.logStatusChange.subscribe(data => {
      if (data) {
        this.logStatus = data;
      }
    });

    this.projectManagementService.logTitleChange.subscribe(data => {
      if (data) {
        this.title = data;
      }
    });

    // this.projectsService.createProjectChangeLog(this.currentProjectId, savingMockData).subscribe(data => {
    //   this.createdChangeLog = data.data;
    //   console.log('createdChangeLog', data);
    // });



    this.projectsService.getIndividualProject(this.currentProjectId).subscribe(res => {
      this.projectInfo = res.data;
      console.log('project info: ', this.currentProjectId, this.projectInfo);
      this.sharedService.getMulipleContacts(res.data.contactId).subscribe(contact => {
        this.selectedContact = contact[0];
        this.customerName = this.getContactName(this.selectedContact);
      });
      this.projectName = this.projectInfo.name;
      this.address = this.projectInfo.shippingAddress.address;
      this.city = this.projectInfo.shippingAddress.city;
      this.province = this.projectInfo.shippingAddress.province;
      this.country = this.projectInfo.shippingAddress.country;
      this.postalCode = this.projectInfo.shippingAddress.postalCode;
      this.requestedBy = this.projectInfo.projectManager;
      this.createdAt = moment(this.projectInfo.createdAt).format('MMMM DD, YYYY');
      this.updatedAt = moment(this.projectInfo.updatedAt).format('MMMM DD, YYYY');
    });


    this.sharedService.getUsers().subscribe(res => {
      this.usersList = res;
    });

  }

  ngOnInit () {
    const options = { month: 'long', year: 'numeric', day: 'numeric' };
    // no need to create id because it will come from back end.
    // this.createChangeLogId();

  }

  ngOnDestroy() {
    // this.projectManagementService.saveChangeLog.unsubscribe();
    this.currentProjectId = undefined;
    this.currentChangeLogId = undefined;
  }

  clickIconShipping() {
    // this.switchIconAddress = !this.switchIconAddress;
    this.address = (this.switchIconAddress) ? this.projectInfo.shippingAddress.address :
    this.selectedContact.shippingAddress.city;
    this.city = (this.switchIconAddress) ? this.projectInfo.shippingAddress.city :
    this.selectedContact.shippingAddress.city;
    this.province = (this.switchIconAddress) ? this.projectInfo.shippingAddress.province :
    this.selectedContact.shippingAddress.province;
    this.country = (this.switchIconAddress) ? this.projectInfo.shippingAddress.country :
    this.selectedContact.shippingAddress.country;
    this.postalCode = (this.switchIconAddress) ? this.projectInfo.shippingAddress.postalCode :
    this.selectedContact.shippingAddress.postalCode;
    this.switchIconAddress = !this.switchIconAddress;
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

  updatePmProfile() {
    this.switchIconPm = !this.switchIconPm;
    this.updatePm = this.switchIconPm;
  }

  getContactNameFromId(id) {
    this.selectedContact = this.contactsList.filter(c => c.id === id)[0];
    return this.selectedContact.name;
  }

  getCustomerNameFromUsername(username) {
    const selectedUser = this.usersList.filter(c => c.username === username)[0];
    return selectedUser.name;
  }

  getContactName(selectedContact) {
    if (selectedContact.type === 'PERSON') {
      selectedContact.name = selectedContact.person.firstName + ' ' + selectedContact.person.lastName;
    } else {
      selectedContact.name = selectedContact.business.name;
    }
    return selectedContact.name;
  }
}
