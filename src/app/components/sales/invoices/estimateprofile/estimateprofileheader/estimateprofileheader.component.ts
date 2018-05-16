import { Component, HostListener, Input, OnInit } from '@angular/core';
import { EstimatesService } from '../../../../../services/estimates.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-estimateprofileheader',
  templateUrl: './estimateprofileheader.component.html',
  styleUrls: ['./estimateprofileheader.component.css']
})
export default class EstimateProfileHeaderComponent implements OnInit {

  status = '';
  invoiceId: Number;
  constructor(private estimatesService: EstimatesService, private route: ActivatedRoute ) {

  }
  ngOnInit() {
    // this.status = this.route.snapshot.paramMap.get('title');
    this.invoiceId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.estimatesService.getIndividualEstimate(this.invoiceId).subscribe(res => {
      this.status = res.data.status;
    });
  }
}
