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
    './po-table.component.css',
  ]
})


export class POTableComponent implements OnInit {
  @Input() productDetails;
  @Input() set poId(_id: string) {
    // this.po_id = parseInt(_id.replace('PO-', ''), 10);
    this.po_id = _id.replace('PO-', '');
  }
  @Output() priceChange: EventEmitter<any> = new EventEmitter();
  private selectedSku: string;
  private skuService: CompleterData;
  private skus = [];
  private originSkus = [];
  po_id: string;
  taxRateOptions = [];
  selectedTaxRateId: number;
  poProductModel: any;

  constructor(private completerService: CompleterService, private sharedService: SharedService) {

    this.sharedService.getInventoryProducts().subscribe(productsRes => {
      productsRes.results.forEach(product => {
        this.sharedService.getInventoryProductSkus(product.id).subscribe(skuRes => {
          this.skus = this.skus.concat(skuRes.results);
          this.originSkus = this.skus.slice();
          this.skuService = completerService.local(this.skus, 'sku', 'sku');
        });
      });
      this.sharedService.getTaxRates().subscribe(taxRateRes => {
        this.taxRateOptions = taxRateRes.results;
        this.addNewProduct();
      });
    });
  }
  ngOnInit() {
  }

  addNewProduct() {
    const newProduct = new ProductDetailInfo();
    newProduct.taxRateId = this.taxRateOptions[0].id;
    this.productDetails.push(newProduct);
  }

  removeProduct(index) {
    // Add sku of removing item to skus service
    const addingItem = this.originSkus.filter(sku => sku.sku === this.productDetails[index].sku);
    this.skus = this.skus.concat(addingItem);

    this.skuService = this.completerService.local(this.skus, 'sku', 'sku');

    this.sharedService.deletePurchaseOrderProduct(this.po_id, this.productDetails[index].purchaseOrderProductId).subscribe(res => {
      this.productDetails.splice(index, 1);
      this.priceChange.emit(null);
    });
  }

  onSkuSelected(item: CompleterItem, index) {
    this.sharedService.getInventoryProduct(item.originalObject.productId).subscribe(res => {
      // Remove selected Sku from SkuService (Autocomplete service for skus)
      this.skus = this.skus.filter((sku) => sku.sku !== item.originalObject.sku);
      this.skuService = this.completerService.local(this.skus, 'sku', 'sku');


      const product = res.data;
      this.productDetails[index].sku = item.originalObject.sku;
      this.productDetails[index].readonly = true;
      this.productDetails[index].taxRateId = this.taxRateOptions[0].id;
      this.selectedTaxRateId = this.taxRateOptions[0].id;
      this.productDetails[index].taxrate = this.taxRateOptions[0].rate;
      this.productDetails[index].supplierId = product.supplierId;
      this.productDetails[index].model = product.model;
      this.productDetails[index].unitprice = item.originalObject.cost;
      this.productDetails[index].name = product.name;
      this.productDetails[index].quantity = 1;
      // this.productDetails[index].measure = product.unitOfMeasure.quantity;
      this.poProductModel = {
        sku: item.originalObject.sku,
        taxRateId: this.taxRateOptions[0].id,
        supplierId: product.supplierId,
        discount: {
          value: 0,
          unit: 'PERCENT'
        },
        quantity: 1
      };
      this.sharedService.addPurchaseOrderProduct(this.po_id, this.poProductModel).subscribe(resp => {
        this.productDetails[index].purchaseOrderProductId = resp.data.id;
        this.productDetails[index].quantity = 1;
        this.productDetails[index].total = resp.data.total;
        this.productDetails[index].unitOfMeasure = resp.data.unitOfMeasure;

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

  changedTaxRate(index, e) {
    this.selectedTaxRateId =  this.taxRateOptions[e.target.selectedIndex].id;
    this.productDetails[index].taxrate = this.taxRateOptions[e.target.selectedIndex].rate;
    this.updatePurchaseOrderProduct(index);
  }

  updatePurchaseOrderProduct(index) {
    if (this.productDetails[index].discount === undefined) {
      this.productDetails[index].discount = 0;
    }
    if (this.productDetails[index].quantity === undefined) {
      this.productDetails[index].quantity = 1;
    }
    this.poProductModel = {
      sku: this.productDetails[index].sku,
      taxRateId: this.selectedTaxRateId,
      supplierId: this.productDetails[index].supplierId,
      discount: {
        value: parseInt(this.productDetails[index].discount, 10),
        unit: 'PERCENT'
      },
      received: 0,
      quantity: parseInt(this.productDetails[index].quantity, 10)
    };
    this.sharedService.updatePurchaseOrderProduct(this.po_id, this.productDetails[index].purchaseOrderProductId, this.poProductModel)
    .subscribe(res => {
      this.productDetails[index].total = res.data.total;
      this.priceChange.emit(null);
    });
  }
}

