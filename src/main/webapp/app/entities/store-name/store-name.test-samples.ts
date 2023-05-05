import { IStoreName, NewStoreName } from './store-name.model';

export const sampleWithRequiredData: IStoreName = {
  id: 34508,
};

export const sampleWithPartialData: IStoreName = {
  id: 39330,
};

export const sampleWithFullData: IStoreName = {
  id: 21713,
  name: 'users Colorado olive',
};

export const sampleWithNewData: NewStoreName = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
