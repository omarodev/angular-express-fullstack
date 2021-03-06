import { Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ProductDetailInfo } from '../../../../../models/ProductDetailInfo.model';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { SharedService } from '../../../../../services/shared.service';

@Component({
  selector: 'app-po-table',
  templateUrl: './po-table.component.html',
  styleUrls: [
    './po-table.component.css'
  ]
})


export class POTableComponent implements OnInit {
  @Input() canUpdate: boolean;
  @Input() set productDetailsData (val) {
    console.log('product details: ', val);
    if (val.length !== 0) {
      this.productDetails = val;
      this.productDetails.map(productDetail => {
        this.stockcontrolStatus = productDetail.stockcontrolStatus;
        productDetail.transferProductId = productDetail.id;
        return productDetail;
      });
      this.sharedService.getInventoryProducts().subscribe(productsRes => {
        productsRes.results.forEach(product => {
          this.sharedService.getInventoryProductSkus(product.id).subscribe(skuRes => {
            this.skus = this.skus.concat(skuRes.results);
            this.skus = _.uniqBy(this.skus, 'sku');
            this.productDetails.forEach(productDetail => {
              this.skus = this.skus.filter(sku => sku.sku !== productDetail.sku);
            });
            console.log('skus filters:', this.skus);
            this.originSkus = this.skus.slice();
            this.skuService = this.completerService.local(this.skus, 'sku', 'sku');
          });
        });
        this.sharedService.getTaxRates().subscribe(taxRateRes => {
          this.taxRateOptions = taxRateRes.results;
          this.addNewProduct();
        });
      });
    } else {
      console.log('product added');
      this.sharedService.getInventoryProducts().subscribe(productsRes => {
        productsRes.results.forEach(product => {
          this.sharedService.getInventoryProductSkus(product.id).subscribe(skuRes => {
            this.skus = this.skus.concat(skuRes.results);
            this.skus = _.uniqBy(this.skus, 'sku');
            this.productDetails.forEach(productDetail => {
              this.skus = this.skus.filter(sku => sku.sku !== productDetail.sku);
            });
            this.originSkus = this.skus.slice();
            this.skuService = this.completerService.local(this.skus, 'sku', 'sku');
          });
        });
        this.sharedService.getTaxRates().subscribe(taxRateRes => {
          this.taxRateOptions = taxRateRes.results;
          if (this.productDetails.length === 0) { this.addNewProduct(); }
        });
      });
    }
  }  @Input() set adId(_id: string) {
    this.ad_id = parseInt(_id.replace('AD-', ''), 10);
  }

  @Output() priceChange: EventEmitter<any> = new EventEmitter();

  private selectedSku: string;
  private skuService: CompleterData;
  private skus = [];
  private originSkus = [];
  ad_id: number;
  taxRateOptions = [];
  selectedTaxRateId: number;
  trProductModel: any;
  productDetails = [];
  // quantityError: boolean;
  stockcontrolStatus = 'OPEN';

  constructor(private completerService: CompleterService, private sharedService: SharedService) {
  }

  ngOnInit() {
  }

  addNewProduct() {
    const newProduct = new ProductDetailInfo();
    newProduct.taxRateId = this.taxRateOptions[0].id;
    if (this.stockcontrolStatus !== 'OPEN') { newProduct.readonly = true; }
    this.productDetails.push(newProduct);
  }

  removeProduct(index) {
    // Add sku of removing item to skus service
    if (this.canUpdate) {
      const addingItem = this.originSkus.filter(sku => sku.sku === this.productDetails[index].sku);
      this.skus = this.skus.concat(addingItem);

      this.skuService = this.completerService.local(this.skus, 'sku', 'sku');
      this.sharedService.deleteInventoryAdjustmentProduct(this.ad_id,
        this.productDetails[index].transferProductId).subscribe(res => {
        this.productDetails.splice(index, 1);
        this.priceChange.emit(null);
      });
    }
  }

  onSkuSelected(item: CompleterItem, index) {
    this.sharedService.getInventoryProduct(item.originalObject.productId).subscribe(res => {
      // Remove selected Sku from SkuService (Autocomplete service for skus)
      this.skus = this.skus.filter((sku) => sku.sku !== item.originalObject.sku);
      this.skuService = this.completerService.local(this.skus, 'sku', 'sku');

      const product = res.data;
      this.productDetails[index].sku = item.originalObject.sku;
      this.productDetails[index].quantityError = false;
      this.productDetails[index].readonly = true;
      this.productDetails[index].taxRateId = this.taxRateOptions[0].id;
      this.selectedTaxRateId = this.taxRateOptions[0].id;
      this.productDetails[index].taxrate = this.taxRateOptions[0].rate;
      this.productDetails[index].supplierId = product.supplierId;
      this.productDetails[index].model = product.model;
      this.productDetails[index].unitPrice = item.originalObject.cost;
      this.productDetails[index].name = product.name;
      this.productDetails[index].quantity = 1;
      this.trProductModel = {
        sku: item.originalObject.sku,
        taxRateId: this.taxRateOptions[0].id,
        quantity: 1
      };
      this.sharedService.addInventoryAdjustmentProduct(this.ad_id, this.trProductModel).subscribe(resp => {
        this.productDetails[index].transferProductId = resp.data.id;
        this.productDetails[index].total = resp.data.total;
        this.productDetails[index].unitOfMeasure = resp.data.unitOfMeasure;
        this.productDetails[index].quantity = resp.data.quantity;
        this.priceChange.emit(null);
      });
    });
    if (index === this.productDetails.length - 1) {
      this.addNewProduct();
    }
  }

  keyListener(event, index) {
    if (event.key === 'Enter' && index === this.productDetails.length - 1) {
      this.addNewProduct();
    }
  }


  calcualteTotalPrice(index: number) {
    this.updatePurchaseOrderProduct(index);
  }


  checkDiscount(e) {
    if (e.which < 47 || e.which > 58 ) {  return false; }
    if (e.target.value >= 100) { e.target.value = 100;  return false; }
    if (e.target.value < 0) { e.target.value = undefined;  return false;  }
  }

  checkValue(e) {
    if (e.which < 47 || e.which > 58 ) { return false; }
    if (e.target.value < 0) { e.target.value = undefined; return false;  }
  }

  checkQuantityValue(e, index) {
    if (e.which < 47 || e.which > 58 ) { return false; }
    // console.log('event :', e.target.value);
    // if (parseInt(e.target.value, 10) < 1) {
    //   this.productDetails[index].quantityError = true;
    // } else {
    //   this.productDetails[index].quantityError = false;
    // }
  }

  changedTaxRate(index, e) {
    this.selectedTaxRateId =  this.taxRateOptions[e.target.selectedIndex].id;
    this.productDetails[index].taxrate = this.taxRateOptions[e.target.selectedIndex].rate;
    this.updatePurchaseOrderProduct(index);
  }

  updatePurchaseOrderProduct(index) {
    if (this.productDetails[index].discount === undefined) {
      this.productDetails[index].discount = 0;
    }

    this.canUpdate = true;
    this.productDetails[index].quantityError = false;
    if (this.productDetails[index].quantity === undefined || !this.productDetails[index].quantity ||  this.productDetails[index].quantity < 1 ) {
      this.canUpdate = false;
      this.productDetails[index].quantityError = true;
    }

    this.trProductModel = {
      taxRateId: this.productDetails[index].taxRateId ? parseInt(this.productDetails[index].taxRateId, 10) : this.taxRateOptions[0].id,
      quantity: parseInt(this.productDetails[index].quantity, 10)
    };
    if (this.canUpdate && !this.productDetails[index].quantityError) {
      this.sharedService.updateInventoryAdjustmentProduct(this.ad_id,
        this.productDetails[index].transferProductId, this.trProductModel).subscribe(res => {
          this.productDetails[index].total = res.data.total;
          this.priceChange.emit(null);
      });
    }
  }
}

