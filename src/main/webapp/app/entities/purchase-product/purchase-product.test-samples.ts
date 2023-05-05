import { IPurchaseProduct, NewPurchaseProduct } from './purchase-product.model';

export const sampleWithRequiredData: IPurchaseProduct = {
  id: 94090,
};

export const sampleWithPartialData: IPurchaseProduct = {
  id: 9062,
  price: 90956,
};

export const sampleWithFullData: IPurchaseProduct = {
  id: 76538,
  name: 'navigate Springs',
  category: 'Future-proofed parsing Bedfordshire',
  price: 59461,
  units: 57675,
  from: 'and',
  company: 'capacitor',
};

export const sampleWithNewData: NewPurchaseProduct = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
