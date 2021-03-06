import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../../../../services/shared.service';
import { ProductsService } from '../../../../../services/inventory/products.service';

@Component({
  selector: 'app-productinfobar',
  templateUrl: './productinfobar.component.html',
  styleUrls: [
    './productinfobar.component.css'
  ],
  entryComponents: [
  ]
})
export class ProductInfoBarComponent implements OnInit {

  @Input() set productInfo(val) {
    this._productInfo = val;
  }
  data1: any;
  showEditImageModal = false;
  keywordsList;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  selectedUncroppedFile: any;
  _productInfo: any;
  // croppedImage = this.productInfo.profileLink;

  constructor(private router: Router, private sharedService: SharedService, private productsService: ProductsService) {
    this.data1 = {};
    this.sharedService.getKeywords().subscribe(res => {
      this.keywordsList = res.results;
      console.log('keywords: ', this.keywordsList);
    });
  }

  ngOnInit() {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.selectedUncroppedFile = event.target.files[0];
  }
  imageCropped(image: string) {
    this.croppedImage = image;
  }

  imageLoaded() {

  }

  cancelCrop() {
    this.showEditImageModal = false;
  }

  saveCrop() {
    this.showEditImageModal = false;
    this._productInfo.pictureURI = this.croppedImage;
    const uploadData = new FormData();
    uploadData.append('productPicture', this.selectedUncroppedFile, this.selectedUncroppedFile.name);

    this.productsService.uploadProductProfileImage(this._productInfo.id, uploadData).subscribe(res => {
      console.log('imga result: ', res);
    });
  }

  changeImage() {
    this.showEditImageModal = true;
  }

  getTagName(id) {
    return this.keywordsList.filter(k => k.id === id)[0].name;
  }
  loadImageFailed() {
  }

}

