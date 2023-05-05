import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 7813,
};

export const sampleWithPartialData: IEmployee = {
  id: 37115,
  address: 'Quality Cambridgeshire asymmetric',
  phoneNo: 50464,
  username: 'empower e-tailers internet',
};

export const sampleWithFullData: IEmployee = {
  id: 44612,
  name: 'grey SSL sensor',
  address: 'National Analyst Cambridgeshire',
  phoneNo: 35453,
  job: 'GB open-source',
  username: 'Loan challenge Iranian',
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
