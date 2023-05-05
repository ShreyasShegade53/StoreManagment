import { IStock, NewStock } from './stock.model';

export const sampleWithRequiredData: IStock = {
  id: 51685,
};

export const sampleWithPartialData: IStock = {
  id: 62180,
  category: "Toys Pa'anga",
  purchasePrice: 62400,
  salePrice: 62974,
  units: 65170,
};

export const sampleWithFullData: IStock = {
  id: 62319,
  name: 'Planner purple Cotton',
  category: 'Chair Money',
  purchasePrice: 81392,
  salePrice: 71888,
  units: 30558,
  company: 'Central matrix invoice',
};

export const sampleWithNewData: NewStock = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
