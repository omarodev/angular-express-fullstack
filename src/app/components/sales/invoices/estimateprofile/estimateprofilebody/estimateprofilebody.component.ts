import { Component, OnInit, Input } from '@angular/core';
import { ProductDetailInfo } from '../../../../../models/ProductDetailInfo.model';
import { Ng2TimelineComponent } from '../../../../profile/ng2-timeline/ng2timeline.component';
import { MultiKeywordSelectComponent } from '../../../../profile/multikeywordselect/multikeywordselect.component';
import { SharedService } from '../../../../../services/shared.service';
import { InvoicesService } from '../../../../../services/invoices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceModel } from '../../../../../models/invoice.model';
import { FilterService } from '../../filter.service';
import { EstimatesService } from '../../../../../services/estimates.service';
import * as moment from 'moment';
import { ProjectsService } from '../../../../../services/projects.service';

@Component({
  selector: 'app-estimateprofilebody',
  templateUrl: './estimateprofilebody.component.html',
  styleUrls: ['./estimateprofilebody.component.css']
})
export class EstimateProfileBodyComponent implements OnInit {
  // @Input() createdInvoice;

  @Input() set createdInvoice(_createdInvoice) {
  }

  invoice_mock: any;
  userList = [];
  classList = [];
  categoryList = [];
  projects = [];
  changeLogNumbers = ['Number 1', 'Number 2', 'Number 3' ];
  labelText = 'Use customer address';
  title = 'Terms of the Estimate';
  dueDateTitle = 'Expiry Date';
  invoiceNumberTitle = 'Estimate #';
  subtotalServices = undefined;
  shippingAddress = {
    address: '',
    street: '',
    city: '',
    country: '',
    postcode: ''
  };
  customerAddress =  {
    address: '',
    street: '',
    city: '',
    country: '',
    postcode: ''
  };

  terms = [];
  selectedTerm = '';
  dueDate: any;
  productDetails: any;
  internalMemo = undefined;
  subtotalproducts = undefined;
  discountType: string;
  discountAmount: number;
  freightcosts = undefined;
  taxes = undefined;
  totalamountdue = undefined;
  taxrate = 0;
  origin_taxes = undefined;
  oneSide = true;
  depositsAmount = undefined;
  in_id = '';
  createdDate: any;
  contactList: any;
  noteToSupplier: string;

  emailAddresses = [];
  termsOfInvoice = '';
  emails: any;
  currentClass: string;
  currentClassId: number;
  currentCategory: string;
  currentCategoryId: number;
  showConvertConfirmModal = false;

  public timelineData: Array<Object> = [
    {
      title: 'Meeting',
      icon: 'fa-home',
      content: 'Conference on the sales for the previous year. Monica please examine sales trends in marketing and products.\
       Below please find the currnet status of the sale',
      timelineBtnColor: 'green-btn',
      buttontitle: 'More Info',
      date: '2018-1-9',
      buttonClickEventHandlerName: 'getMoreInfo'
    },
    {
      title: 'Send Document to Mike',
      icon: 'fa-file-text-o',
      content: 'Conference on the sales for the previous year. Monica please examine sales trends in marketing and products.\
       Below please find the currnet status of the sale',
      timelineBtnColor: 'blue-btn',
      buttontitle: 'Download document',
      date: '2018-1-9',
      buttonClickEventHandlerName: 'downloadDoc'
    },
    {
      title: 'Coffee Break',
      icon: 'fa-coffee',
      content: 'Conference on the sales for the previous year. Monica please examine sales trends in marketing and products.\
       Below please find the currnet status of the sale',
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

  currentInvoiceId: number;
  saveInvoiceData: any;
  currentOwner: string;
  estimateStatus = 'NEW';

  constructor(private sharedService: SharedService, private estimatesService: EstimatesService, private invoicesServices: InvoicesService,
    private route: ActivatedRoute, private filterService: FilterService, private router: Router, private projectsService: ProjectsService) {
    this.createdDate = new Date().toJSON();

    //
    this.currentInvoiceId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.estimatesService.getIndividualEstimate(this.currentInvoiceId).subscribe(res => {
      this.estimateStatus = res.data.status;
      this.sharedService.getContacts()
      .subscribe(data => {
        data = this.addContactName(data);
        this.contactList = data;
        this.userList = this.contactList;
        this.customerAddress = this.getContactAddress(this.contactList, res.data.contactId);
      });

      this.sharedService.getTerms().subscribe(data => {
        this.terms = data.results;
      });

      this.sharedService.getClassifications().subscribe(data => {
        this.classList = data.results;
        const classPos = this.classList.map(t => t.id).indexOf(this.currentClassId);
        this.currentClass = this.classList[classPos].name;
      });

      this.sharedService.getInvoiceCategories().subscribe(data => {
        this.categoryList = data.results;
        const categoryPos = this.categoryList.map(t => t.id).indexOf(this.currentCategoryId);
        this.currentCategory = this.categoryList[categoryPos].name;
      });

      this.saveInvoiceData = res.data;
      // change contact id to number
      // tslint:disable-next-line:max-line-length
      this.saveInvoiceData.contactId = res.data.contactId ? parseInt(res.data.contactId.split('-').pop(), 10) : parseInt(res.data.leadId.split('-').pop(), 10);
      this.discountType = res.data.discount.unit;
      this.discountAmount = res.data.discount.value;
      this.internalMemo = res.data.internalNote;
      this.noteToSupplier = res.data.customerNote;
      this.termsOfInvoice = res.data.terms;
      this.createdDate = moment(res.data.createdAt).format('YYYY-MM-DD');
      this.dueDate = res.data.expiryDate;
      this.subtotalproducts = res.data.productSubTotal;
      this.subtotalServices = res.data.serviceSubTotal;
      this.taxes = res.data.taxTotal;
      this.discountType = res.data.discount.unit;
      this.discountAmount = res.data.discount.value;
      this.totalamountdue = res.data.total;
      this.currentClassId = res.data.classificationId;
      this.currentCategoryId = res.data.categoryId;
      this.currentOwner = res.data.owner;
      this.emailAddresses = res.data.emails;
      this.shippingAddress = res.data.shippingAddress;
    });
    this.estimatesService.getEstimatesProducts(this.currentInvoiceId).subscribe(res => {
      console.log('estimates productsS:', res.results);
      const estimateProducts = res.results;
      estimateProducts.map(i => {
        i['unitprice'] = i.unitPrice;
        i['discountvalue'] = i.discount.value;
        i['readonly'] = true;
        return i;
      });
      this.productDetails = {
        products: estimateProducts,
        status: this.estimateStatus
      };
    });

    this.projectsService.getProjectsList().subscribe(res => {
      this.projects = res.results.map(project => project.id);
    });
  }

  ngOnInit() {

    this.in_id = 'ES - ' + this.currentInvoiceId;

    this.filterService.chargeFeeData.subscribe(data => {
      if (data.lateFee) {
        this.saveInvoiceData.chargeLateFee = data.lateFee;
        this.saveInvoiceData.lateFee.value = data.value;
        this.saveInvoiceData.lateFee.unit = data.unit;
      }
    });
    this.filterService.saveClicked.next(false);
    this.filterService.saveClicked.subscribe(data => {
      if (data) {
        this.saveInvoice();
      }
    });
    this.filterService.deleteClicked.next(false);
    this.filterService.deleteClicked.subscribe(data => {
      if (data) {
        this.deleteInvoice();
      }
    });
    this.filterService.convertClicked.next(false);
    this.filterService.convertClicked.subscribe(data => {
      if (data) {
        this.convertInvoice();
      }
    });
  }

  getContactName(list, id) {
    const idList = list.map( c => c.id);
    const pos = idList.indexOf(id);
    return list[id].person.firstName + ' ' + list[id].person.lastName;
  }

  getContactAddress(list, id) {

    const idList = list.map( c => c.id);
    const pos = idList.indexOf(id);
    return list[pos].shippingAddress;
  }

  onCustomerSelected(user) {
  }

  onSelectUser(selectedIndex: any) {

    const contactIdList = this.contactList.map(c => c.id);
    const pos = contactIdList.indexOf(selectedIndex);
    this.customerAddress = this.contactList[pos].shippingAddress;
    this.saveInvoiceData.contactId = selectedIndex;
  }

  onSelectClass(val) {
    this.saveInvoiceData.classificationId = val;
  }

  onSelectCategory(val) {
    this.saveInvoiceData.categoryId = val;
  }

  changedDueDate(event) {
    this.saveInvoiceData.expiryDate = event;
  }

  onChangedMemo(event) {
    this.saveInvoiceData.internalNote = event;
  }

  onChangedNote(event) {
    this.saveInvoiceData.customerNote = event;
  }

  onChangedTermsOfInvoice(event) {
    this.saveInvoiceData.terms = event;
  }

  onChangeProject(event) {
    this.saveInvoiceData.projectId = event;
    this.projectsService.getProjectChangeLogs(event).subscribe(res => {
      this.changeLogNumbers = res.results;
      console.log('changeLog numbers:', this.changeLogNumbers);
    });
  }

  onChooseChangeLog(event) {
    this.saveInvoiceData.changeLog = event.target.value;
  }

  getMultiEmails(event) {
    this.saveInvoiceData.emails = event;
  }

  onChangeTerm(event) {
  }

  getUpdatedShippiingAddress(event) {
    this.saveInvoiceData.billingAddress = event.data;
  }

  getShippingAddress(event) {
    this.saveInvoiceData.shippingAddress = event.data;
  }

  onPriceChanged() {
    this.saveInvoice();
  }

  onTotalPriceChange(data) {
    if (data.type) {
      this.saveInvoiceData.discount.unit = data.type;
      this.saveInvoiceData.discount.value = data.amount;
    } else {
      this.saveInvoiceData.deposit = data.depositsAmount;
    }
    this.saveInvoice();
  }

  saveInvoice() {
    if (!this.saveInvoiceData.deposit) {
      this.saveInvoiceData.deposit = 0;
    }
    if (this.saveInvoiceData.recurring === null) {
      this.saveInvoiceData.recurring = [];
    }
    if (this.saveInvoiceData.terms === null) {
      this.saveInvoiceData.terms = '';
    }
    if (this.saveInvoiceData.internalNote === null) {
      this.saveInvoiceData.internalNote = '';
    }
    if (this.saveInvoiceData.customerNote === null) {
      this.saveInvoiceData.customerNote = '';
    }
    if (this.saveInvoiceData.reminder === null) {
      this.saveInvoiceData.reminder = [];
    }
    this.estimatesService.updateEstimate(this.currentInvoiceId, this.saveInvoiceData).subscribe( res => {
      this.taxes = res.data.taxTotal;
      this.totalamountdue = res.data.total;
      this.subtotalServices = res.data.serviceSubTotal;
      this.subtotalproducts = res.data.productSubTotal;
      this.estimatesService.sendEmail(this.currentInvoiceId).subscribe();
    });
  }

  convertInvoice() {
    this.showConvertConfirmModal = true;
    console.log('1111111111');
  }

  confirmConvert() {
    this.showConvertConfirmModal = false;
    this.saveInvoiceData.startDate = moment().format('YYYY-MM-DD');
    this.saveInvoiceData.termId = 1;
    this.invoicesServices.createInvoice(this.saveInvoiceData).subscribe(res => {
      console.log('convert: ', res);
      this.router.navigate(['./invoice-profile', {id: res.data.id}]);
    });
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
  deleteInvoice() {
    this.estimatesService.deleteIndividualEstimate(this.currentInvoiceId).subscribe( res => {
      this.router.navigate(['./sales/invoices']);
    });
  }
}
