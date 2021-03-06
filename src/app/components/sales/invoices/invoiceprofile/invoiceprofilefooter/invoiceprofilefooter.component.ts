import { Component, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterService } from '../../filter.service';
import { InvoicesService } from '../../../../../services/invoices.service';

@Component({
  selector: 'app-invoiceprofilefooter',
  templateUrl: './invoiceprofilefooter.component.html',
  styleUrls: ['./invoiceprofilefooter.component.css']
})
export class InvoiceProfileFooterComponent implements OnInit, OnDestroy {

  settingsCollapsed = true;
  showReminderModal = false;

  currency = 'CAD';
  language = 'ENG';
  showButtons = false;
  showPrintOptions = false;
  printOptions = {
    brand: false,
    qty: false,
    supplier: false,
    totalprice: false
  };
  showEndBy = false;
  showEndAfter = false;
  startDate: any;
  endDate: any;

  chargeFeeUnit: string;
  chargeFeeValue: number;
  chargeSwitchOn: false;
  currentInvoiceId: string;
  reminderSwitchOn = false;
  recurringSwitchOn = false;
  creditSwitchOn = false;
  switchOn = false;
  frequency = 'Daily';
  maxFrequency: any;
  showRecurringModal = false;
  template: any;
  Interval = '';
  currentInvoice: any;
  invoiceStatus: any;

  constructor(
    private router: Router,
    private filterService: FilterService,
    private invoicesService: InvoicesService,
    private route: ActivatedRoute) {

      this.currentInvoiceId = this.route.snapshot.paramMap.get('id');
      this.invoicesService.getIndividualInvoice(this.currentInvoiceId).subscribe(res => {
        console.log('current invoice', res);
        this.currentInvoice = res.data;
        this.invoiceStatus = res.data.status;
      });
  }

  ngOnInit() {
    // this.chargeFeeUnit = this.createdInvoice.
    this.currentInvoiceId = this.route.snapshot.paramMap.get('id');
    this.invoicesService.getIndividualInvoice(this.currentInvoiceId).subscribe(res => {
      this.chargeFeeUnit = res.data.lateFee.unit;
      this.chargeFeeValue = res.data.lateFee.value;
      this.chargeSwitchOn = res.data.chargeLateFee;
    });
  }

  cancelInvoice() {
    // const invoiceId = this.createdInvoice.id;
    // this.invoicesService.deleteInvoice(invoiceId).subscribe
    this.router.navigate(['./sales/invoices']);
  }

  saveInvoice() {
    const chargeFeeData = {
      chargeFee: this.chargeSwitchOn,
      unit: this.chargeFeeUnit,
      value: this.chargeFeeValue
    };

    this.filterService.chargeFeeData.next(chargeFeeData);
    this.filterService.saveClicked.next( true );
    this.router.navigate(['./sales/invoices']);
  }

  voidInvoice() {
    this.filterService.voidClicked.next( true );
  }

  onSwitchChanged(val) {

  }

  onEndTypeSelectionChange(value) {
    if (value === 'endBy') {
      this.showEndBy = true;
      this.showEndAfter = false;
    } else {
      this.showEndBy = false;
      this.showEndAfter = true;
    }
  }

  deleteInvoice() {
    this.filterService.deleteClicked.next( true );
  }

  ngOnDestroy() {
    this.filterService.saveClicked.next( false );
    this.filterService.deleteClicked.next( false );
    this.filterService.voidClicked.next( false );
  }
}
