export class EstimateModel {
  id: string;
  changeLogId: string;
  currencyId: number;
  contactId: string;
  leadId: string;
  pricingCategoryId: number;
  classificationId: number;
  categoryId: number;
  emails: string[];
  status: string;
  shippingAddress: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string
  };
  billingAddress: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string
  };
  internalNote: string;
  customerNote: string;
  terms: string;
  expiryDate: string;
  discount: {
    value: number;
    unit: string
  };
  productSubTotal: number;
  serviceSubTotal: number;
  taxTotal: number;
  total: number;
  deposit: number;
  createdAt: string;
  updatedAt: string;
}
