import { Component, Input, OnInit, HostListener, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MultiKeywordSelectComponent } from '../../../profile/multikeywordselect/multikeywordselect.component';
import { CompleterService, CompleterData } from 'ng2-completer';
import { CrmService } from '../../../../services/crm.service';
import * as moment from 'moment';
import { SharedService } from '../../../../services/shared.service';
import { FilterService } from '../filter.service';
import { countries } from '../../../../../assets/json/countries';
import { provinces } from '../../../../../assets/json/provinces';
import * as countryList from 'country-list';

@Component({
  selector: 'app-addcontact',
  templateUrl: './addcontact.component.html',
  styleUrls: [
    './addcontact.component.css',
  ]
})


export class AddContactComponent implements OnInit {
  @ViewChild('tabsRef', {read: ElementRef}) tabsRef: ElementRef;
  @Input() contactsListInfo;
  @Input() contactOwners;
  @Input() contactStatus;
  @Output() addToContactsList: EventEmitter<any> = new EventEmitter;
  searchStr = '';
  captain = '';
  captainSource: string;
  dataService: CompleterData;
  countriesSource: CompleterData;
  provincesSource: CompleterData;
  billingCountriesSource: CompleterData;
  billingProvincesSource: CompleterData;
  searchData = [
    { color: 'red', value: '#f00' },
    { color: 'green', value: '#0f0' },
    { color: 'blue', value: '#00f' },
    { color: 'cyan', value: '#0ff' },
    { color: 'magenta', value: '#f0f' },
    { color: 'yellow', value: '#ff0' },
    { color: 'black', value: '#000' }
  ];
  captains = ['Head Contact', 'Accounts Receivable'];
  captainsSource = ['Contact referal'];

  addContactModalCollapsed = true;
  showAddContactModal = false;
  switchIconShipping = true;
  address = '';
  city = '';
  province = '';
  postalCode = '';
  country: any;
  typeAccountTypeChange = false;
  keywords: any;
  contactAssociation: any;
  businessType = 'PERSON';
  tabActiveFirst = true;
  tabActiveSecond = false;
  invalidFirstname = false;
  invalidLastname = false;
  invalidBusinessName = false;
  invalidAccountType = false;
  invalidContactEmail = false;
  firstName = '';
  lastName = '';
  businessName = '';
  defaultTerm = 2;
  defaultCurrency = 1;
  defaultPricing = 1;
  primaryNumber = '';
  invalidDefaultTerm = false;
  invalidDefaultCurrency = false;
  invalidDefaultPricing = false;
  invalidPrimaryNumber = false;
  invalidAddress = false;
  invalidCity = false;
  invalidProvince = false;
  invalidCountry = false;
  invalidPostalCode = false;
  sourceValue = true;
  newEmail = '';
  newAddress = '';
  selectOwner = '';

  currencyList = [];
  keywordsIdList = [];
  headContact = '';
  jobTitle = '';
  email = '';
  notes = '';
  billingAddress = '';
  billingCity = '';
  billingProvince = '';
  billingCountry = '';
  billingPostalCode = '';
  secondaryNumber = '';
  termsList = [];
  pricingCategoriesList = [];
  contactsList: any;
  usersList = [];
  sourcesList = [];
  sourcesNameList = [];
  selectedSourceId: any;
  businessAssociation: any;
  newContact: any;
  wrongEmailFormat = false;
  selectedCountry: any;
  selectedProvince: any;
  billingSelectedCountry: any;
  billingSelectedProvince: any;
  invalidPrimaryFormat = false;
  invalidSecondaryFormat = false;
  countriesNameList = countries.map(c => c.name);
  provincesNameList = provinces.map(p => p.name);
  provinceNotIncluded = false;
  selectedProvincesNameList = [];
  contactsSource: CompleterData;
  businessAss: any;

  constructor(private completerService: CompleterService, private sharedService: SharedService, private crmService: CrmService
    , private filterService: FilterService ) {
    this.dataService = completerService.local(this.searchData, 'color', 'color');
    this.keywords = [];
    this.contactAssociation = ['Danny Shibley', 'John Stephen'];
    this.countriesSource = completerService.local(countries, 'name', 'name');
    this.provincesSource = completerService.local(provinces, 'name', 'name');

    this.sharedService.getCurrencies().subscribe(data => {
      this.currencyList = data.results;
    });

    this.sharedService.getTerms().subscribe(res => {
      this.termsList = res.results;
    });

    this.sharedService.getPricingCategories().subscribe (res => {
      this.pricingCategoriesList = res.results;
    });

    this.sharedService.getContacts().subscribe(res => {
      this.contactsList = res;
      console.log('contactslist: ', this.contactsList);
      this.addContactName(this.contactsList);
      this.sharedService.getUsers().subscribe(user => {
        this.usersList = user;
        this.usersList.forEach(element => {
          element.name = element.username;
        });
        this.contactsSource = this.completerService.local(this.contactsList, 'name', 'name');
      });
    });

    this.sharedService.getUsers().subscribe(res => {
      this.usersList = res;
    });

    this.sharedService.getSources().subscribe(res => {
      this.sourcesList = res.results;
      this.sourcesNameList = res.results.map(n => n.source);
    });
  }

  ngOnInit() {

  }

  onAccountTypeChange(event) {
    this.invalidFirstname = false;
    this.invalidLastname = false;
    this.invalidBusinessName = false;
    this.invalidAccountType = false;
    this.invalidPrimaryNumber = false;
    this.invalidContactEmail = false;
    this.invalidAddress = false;
    this.invalidCity = false;
    this.invalidProvince = false;
    this.invalidCountry = false;
    this.invalidPostalCode = false;
    if (event === 'PERSON') {
      this.typeAccountTypeChange = false;
    } else if (event === 'BUSINESS') {
      this.typeAccountTypeChange = true;
    }
  }

  clickIconShipping() {
    this.switchIconShipping = !this.switchIconShipping;
  }

  onEnter() {
  }

  onSelectCustomer(event) {
    console.log('event: ', event);
    this.businessAssociation = event.originalObject.id;
  }

  checkSource(event) {
    if (this.captainSource === 'Contact referal') {
      this.sourceValue = false;
    } else {
      this.sourceValue = true;
    }
    const pos = this.sourcesNameList.indexOf(event.title);
    this.selectedSourceId = this.sourcesList[pos].id;
  }

  onSelectCountry(event) {
    this.selectedCountry = event.originalObject.code;
    const provincesSourceList = provinces.filter(p => p.country === this.selectedCountry);
    this.provincesSource = this.completerService.local(provincesSourceList, 'name', 'name');
  }

  onSelectProvince(event) {
    this.selectedProvince = event.originalObject.short;
    // const countriesSourceList =  countries.filter(c => c.code === this.selectedProvince);
    this.selectedCountry = event.originalObject.country;
    this.country = countries.filter(c => c.code === this.selectedCountry)[0].name;
  }

  onSelectBillingCountry(event) {
    this.billingSelectedCountry = event.originalObject.code;
    const provincesSourceList = provinces.filter(p => p.country === this.billingSelectedCountry);
    this.provincesSource = this.completerService.local(provincesSourceList, 'name', 'name');
  }

  onSelectBillingProvince(event) {
    this.billingSelectedProvince = event.originalObject.short;
    // const countriesSourceList =  countries.filter(c => c.code === this.selectedProvince);
    this.billingSelectedCountry = event.originalObject.country;
    this.billingCountry = countries.filter(c => c.code === this.selectedCountry)[0].name;
  }

  getKeywords(event) {
    this.keywordsIdList = event.map(k => k.id);
  }

  clickNext() {
    this.invalidFirstname = false;
    this.invalidLastname = false;
    this.invalidBusinessName = false;
    this.invalidAccountType = false;
    this.invalidPrimaryNumber = false;
    this.invalidContactEmail = false;
    this.invalidAddress = false;
    this.invalidCity = false;
    this.invalidProvince = false;
    this.invalidCountry = false;
    this.invalidPostalCode = false;
    this.wrongEmailFormat = !this.checkEmailValidation(this.email);
    this.invalidPrimaryFormat = !this.phoneNumberValidation(this.primaryNumber);
    if (this.secondaryNumber) {
      this.invalidSecondaryFormat = !this.phoneNumberValidation(this.secondaryNumber);
    }
    if (!this.countriesNameList.includes(this.country)) {
      this.provinceNotIncluded = true;
      this.invalidCountry = true;
    } else if (!this.provincesNameList.includes(this.province)) {
      this.provinceNotIncluded = true;
      this.invalidProvince = true;
    }

    if (this.businessType === 'PERSON') {
      if (this.firstName && this.lastName && this.primaryNumber && this.email && !this.wrongEmailFormat && this.address &&
        !this.provinceNotIncluded && this.city && this.province && this.country && this.postalCode &&
        !this.invalidPrimaryFormat && !this.invalidSecondaryFormat) {
        this.tabActiveFirst = false;
        this.tabActiveSecond = true;
      } else {
        if (!this.firstName) {
          this.invalidFirstname = true;
        }
        if (!this.lastName) {
          this.invalidLastname = true;
        }
        if (!this.primaryNumber) {
          this.invalidPrimaryNumber = true;
        }
        if (!this.email || this.wrongEmailFormat) {
          this.invalidContactEmail = true;
        }
        if (!this.address) {
          this.invalidAddress = true;
        }
        if (!this.city) {
          this.invalidCity = true;
        }
        if (!this.province) {
          this.invalidProvince = true;
        }
        if (!this.country) {
          this.invalidCountry = true;
        }
        if (!this.postalCode) {
          this.invalidPostalCode = true;
        }
      }
    } else if (this.businessType === 'BUSINESS') {
      if (this.businessName && this.email && this.primaryNumber && !this.wrongEmailFormat && this.address &&
        this.city && this.province && this.country && this.postalCode && !this.provinceNotIncluded) {
        this.tabActiveFirst = false;
        this.tabActiveSecond = true;
      } else {
        if (!this.businessName) {
          this.invalidBusinessName = true;
        }
        if (!this.primaryNumber) {
          this.invalidPrimaryNumber = true;
        }
        if (!this.email || this.wrongEmailFormat) {
          this.invalidContactEmail = true;
        }
        if (!this.address) {
          this.invalidAddress = true;
        }
        if (!this.city) {
          this.invalidCity = true;
        }
        if (!this.province) {
          this.invalidProvince = true;
        }
        if (!this.country) {
          this.invalidCountry = true;
        }
        if (!this.postalCode) {
          this.invalidPostalCode = true;
        }
      }
    } else {
      this.invalidAccountType = true;
      if (!this.firstName) {
        this.invalidFirstname = true;
      }
      if (!this.lastName) {
        this.invalidLastname = true;
      }
      if (!this.primaryNumber) {
        this.invalidPrimaryNumber = true;
      }
      if (!this.email || this.wrongEmailFormat) {
        this.invalidContactEmail = true;
      }
      if (!this.address) {
        this.invalidAddress = true;
      }
      if (!this.city) {
        this.invalidCity = true;
      }
      if (!this.province) {
        this.invalidProvince = true;
      }
      if (!this.country) {
        this.invalidCountry = true;
      }
      if (!this.postalCode) {
        this.invalidPostalCode = true;
      }
    }
    // check the switch and make billing address same as shipping address
    if (this.switchIconShipping) {
      this.billingAddress = this.address;
      this.billingCity = this.city;
      this.billingProvince = this.province;
      this.billingCountry = this.country;
      this.billingPostalCode = this.postalCode;
    } else {
      this.billingAddress = '';
      this.billingCity = '';
      this.billingProvince = '';
      this.billingCountry = '';
      this.billingPostalCode = '';
    }
  }

  tabChange(event) {
    switch (event.tabTitle) {
      case 'BASIC INFORMATION': {
        this.tabActiveFirst = true;
        this.tabActiveSecond = false;
        break;
      }
      case 'ADVANCED INFORMATION': {
        this.tabActiveFirst = false;
        this.tabActiveSecond = true;
        this.invalidFirstname = false;
        this.invalidLastname = false;
        this.invalidBusinessName = false;
        this.invalidAccountType = false;
        this.invalidPrimaryNumber = false;
        this.invalidContactEmail = false;
        this.invalidAddress = false;
        this.invalidCity = false;
        this.invalidProvince = false;
        this.invalidCountry = false;
        this.invalidPostalCode = false;
        this.wrongEmailFormat = !this.checkEmailValidation(this.email);
        this.invalidPrimaryFormat = !this.phoneNumberValidation(this.primaryNumber);
        if (this.secondaryNumber) {
          this.invalidSecondaryFormat = !this.phoneNumberValidation(this.secondaryNumber);
        }
        if (!this.countriesNameList.includes(this.country)) {
          this.provinceNotIncluded = true;
          this.invalidCountry = true;
        } else if (!this.provincesNameList.includes(this.province)) {
          this.provinceNotIncluded = true;
          this.invalidProvince = true;
        }

        if (this.businessType === 'PERSON') {
          if (this.firstName && this.lastName && this.primaryNumber && this.email && !this.wrongEmailFormat && this.address &&
            !this.provinceNotIncluded && this.city && this.province && this.country && this.postalCode &&
            !this.invalidPrimaryFormat && !this.invalidSecondaryFormat) {
            this.tabActiveFirst = false;
            this.tabActiveSecond = true;
            break;
          } else {
            setTimeout(() => {
              this.tabActiveFirst = true;
              this.tabActiveSecond = false;
            });
            if (!this.firstName) {
              this.invalidFirstname = true;
            }
            if (!this.lastName) {
              this.invalidLastname = true;
            }
            if (!this.primaryNumber) {
              this.invalidPrimaryNumber = true;
            }
            if (!this.email || this.wrongEmailFormat) {
              this.invalidContactEmail = true;
            }
            if (!this.address) {
              this.invalidAddress = true;
            }
            if (!this.city) {
              this.invalidCity = true;
            }
            if (!this.province) {
              this.invalidProvince = true;
            }
            if (!this.country) {
              this.invalidCountry = true;
            }
            if (!this.postalCode) {
              this.invalidPostalCode = true;
            }
          }
        } else if (this.businessType === 'BUSINESS') {
          if (this.businessName && this.email && this.primaryNumber && !this.wrongEmailFormat && this.address &&
            this.city && this.province && this.country && this.postalCode && !this.provinceNotIncluded) {
            this.tabActiveFirst = false;
            this.tabActiveSecond = true;
          } else {
            setTimeout(() => {
              this.tabActiveFirst = true;
              this.tabActiveSecond = false;
            });
            if (!this.businessName) {
              this.invalidBusinessName = true;
            }
            if (!this.primaryNumber) {
              this.invalidPrimaryNumber = true;
            }
            if (!this.email || this.wrongEmailFormat) {
              this.invalidContactEmail = true;
            }
            if (!this.address) {
              this.invalidAddress = true;
            }
            if (!this.city) {
              this.invalidCity = true;
            }
            if (!this.province) {
              this.invalidProvince = true;
            }
            if (!this.country) {
              this.invalidCountry = true;
            }
            if (!this.postalCode) {
              this.invalidPostalCode = true;
            }
          }
        } else {
          setTimeout(() => {
            this.tabActiveFirst = true;
            this.tabActiveSecond = false;
          });
          this.invalidAccountType = true;
          if (!this.firstName) {
            this.invalidFirstname = true;
          }
          if (!this.lastName) {
            this.invalidLastname = true;
          }
          if (!this.primaryNumber) {
            this.invalidPrimaryNumber = true;
          }
          if (!this.email || this.wrongEmailFormat) {
            this.invalidContactEmail = true;
          }
          if (!this.address) {
            this.invalidAddress = true;
          }
          if (!this.city) {
            this.invalidCity = true;
          }
          if (!this.province) {
            this.invalidProvince = true;
          }
          if (!this.country) {
            this.invalidCountry = true;
          }
          if (!this.postalCode) {
            this.invalidPostalCode = true;
          }
        }
        break;
      }
    }
  }

  checkEmailValidation(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  getContactNameFromId(id) {
    const selectedContact = this.contactsList.filter(c => c.id === id)[0];
    return selectedContact.name;
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

  phoneNumberValidation(number) {
    const re =  /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;
    return re.test(number);
  }

  clearInputs() {
    this.address = '';
    this.city = '';
    this.province = '';
    this.postalCode = '';
    this.country = '';
    this.typeAccountTypeChange = false;
    this.keywords = [];
    this.contactAssociation = undefined;
    this.businessType = 'PERSON';
    this.tabActiveFirst = true;
    this.tabActiveSecond = false;
    this.invalidFirstname = false;
    this.invalidLastname = false;
    this.invalidBusinessName = false;
    this.invalidAccountType = false;
    this.firstName = '';
    this.lastName = '';
    this.businessName = '';
    this.defaultTerm = 2;
    this.defaultCurrency = 1;
    this.defaultPricing = 1;
    this.primaryNumber = '';
    this.invalidDefaultTerm = false;
    this.invalidDefaultCurrency = false;
    this.invalidDefaultPricing = false;
    this.invalidPrimaryNumber = false;
    this.sourceValue = true;
    this.currencyList = [];
    this.keywordsIdList = [];
    this.headContact = undefined;
    this.jobTitle = '';
    this.email = '';
    this.notes = '';
    this.billingAddress = '';
    this.billingCity = '';
    this.billingProvince = '';
    this.billingCountry = '';
    this.billingPostalCode = '';
    this.secondaryNumber = '';
    this.selectedSourceId = undefined;
    this.businessAssociation = undefined;
    this.invalidContactEmail = false;
    this.wrongEmailFormat = false;
    this.invalidAddress = false;
    this.invalidCity = false;
    this.invalidProvince = false;
    this.invalidCountry = false;
    this.invalidPostalCode = false;
  }

  // clean(obj) {
  //   for (const propName in obj) {
  //     if (obj[propName] === null || obj[propName] === undefined || isNaN(obj[propName])) {
  //       delete obj[propName];
  //     }
  //   }
  // }

  clickSaveContact() {
    this.invalidDefaultTerm = false;
    this.invalidDefaultCurrency = false;
    this.invalidDefaultPricing = false;
    if (this.defaultTerm && this.defaultCurrency && this.defaultPricing) {
      if (this.businessType === 'PERSON') {
        this.newContact = {
          'currencyId': this.defaultCurrency,
          'termId': this.defaultTerm,
          'sourceId': parseInt(this.selectedSourceId, 10),
          'pricingCategoryId': this.defaultPricing,
          'keywordIds': this.keywordsIdList,
          'owner': 'string',
          'followers': [
            'string'
          ],
          'type': this.businessType,
          'person': {
            'firstName': this.firstName,
            'lastName': this.lastName,
            'jobTitle': this.jobTitle ? this.jobTitle : 'a',
            'department': this.captain ? this.captain : 'a',
            'businessAssociation': parseInt(this.businessAssociation, 10),
          },
          'shippingAddress': {
            'address': this.address,
            'city': this.city,
            'province': this.selectedProvince,
            'postalCode': this.postalCode,
            'country': this.selectedCountry
          },
          'billingAddress': {
            'address': this.switchIconShipping ? this.address : this.billingAddress,
            'city': this.switchIconShipping ? this.city : this.billingCity,
            'province': this.switchIconShipping ? this.selectedProvince : this.billingSelectedProvince,
            'postalCode': this.switchIconShipping ? this.postalCode : this.billingPostalCode,
            'country': this.switchIconShipping ? this.selectedCountry : this.billingSelectedCountry
          },
          'email':  this.email,
          'socialMediaUrl': {
            'linkedIn': undefined,
            'facebook': undefined,
            'twitter': undefined
          },
          'phoneNumbers': {
            'primary': this.primaryNumber,
            'secondary': this.secondaryNumber,
          },
          'timezone': 1,
          'note': this.notes,
          'lastContacted': moment().format('YYYY-MM-DD')
        };
      } else {
        this.newContact = {
          'currencyId': this.defaultCurrency,
          'termId': this.defaultTerm,
          'sourceId': parseInt(this.selectedSourceId, 10),
          'pricingCategoryId': this.defaultPricing,
          'keywordIds': this.keywordsIdList,
          'owner': 'string',
          'followers': [
            'string'
          ],
          'type': this.businessType,
          'business': {
            'name': this.businessName,
            'headContact': parseInt(this.headContact, 10),
            'accountReceivable': 1,
            'personAssociations': [
              1
            ]
          },
          'shippingAddress': {
            'address': this.address,
            'city': this.city,
            'province': this.selectedProvince,
            'postalCode': this.postalCode,
            'country': this.selectedCountry
          },
          'billingAddress': {
            'address': this.switchIconShipping ? this.address : this.billingAddress,
            'city': this.switchIconShipping ? this.city : this.billingCity,
            'province': this.switchIconShipping ? this.selectedProvince : this.billingSelectedProvince,
            'postalCode': this.switchIconShipping ? this.postalCode : this.billingPostalCode,
            'country': this.switchIconShipping ? this.selectedCountry : this.billingSelectedCountry
          },
          'email':  this.email,
          'socialMediaUrl': {
            'linkedIn': undefined,
            'facebook': undefined,
            'twitter': undefined
          },
          'phoneNumbers': {
            'primary': this.primaryNumber,
            'secondary': this.secondaryNumber,
          },
          'timezone': 1,
          'note': this.notes,
          'lastContacted': moment().format('YYYY-MM-DD')
        };
        if (!this.newContact.business.headContact) {
          delete(this.newContact.business.headContact);
        }
      }

      if (isNaN(this.newContact.sourceId)) {
        delete this.newContact.sourceId;
      }

      if (this.newContact.person) {
        if (isNaN(this.newContact.person.businessAssociation)) {
          delete this.newContact.person.businessAssociation;
        }
      }

      // this.clean(this.newContact);
      console.log('new contact: ', this.newContact);
      this.crmService.createContact(JSON.stringify(this.newContact)).subscribe(data => {
        this.addContactModalCollapsed = true;
        this.showAddContactModal = false;
        this.tabActiveFirst = true;
        this.tabActiveSecond = false;
        // this.clearInputs();
        this.filterService.saveClicked.next(true);
      });
    } else {
      if (!this.defaultCurrency) {
        this.invalidDefaultCurrency = true;
      }
      if (!this.defaultTerm) {
        this.invalidDefaultTerm = true;
      }
      if (!this.defaultPricing) {
        this.invalidDefaultPricing = true;
      }
    }
  }
}
