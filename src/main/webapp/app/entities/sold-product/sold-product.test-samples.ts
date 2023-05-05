import { ISoldProduct, NewSoldProduct } from './sold-product.model';

export const sampleWithRequiredData: ISoldProduct = {
  id: 44409,
};

export const sampleWithPartialData: ISoldProduct = {
  id: 71450,
  name: 'microchip out-of-the-box cultivate',
  price: 93781,
  units: 16117,
  company: 'hacking',
};

export const sampleWithFullData: ISoldProduct = {
  id: 60724,
  name: 'Coordinator Product',
  category: 'Toys Branding',
  price: 98027,
  units: 4419,
  company: 'synergistic Shoes',
};

export const sampleWithNewData: NewSoldProduct = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
