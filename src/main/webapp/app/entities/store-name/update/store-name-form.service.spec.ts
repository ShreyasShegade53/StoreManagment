import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../store-name.test-samples';

import { StoreNameFormService } from './store-name-form.service';

describe('StoreName Form Service', () => {
  let service: StoreNameFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreNameFormService);
  });

  describe('Service methods', () => {
    describe('createStoreNameFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStoreNameFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });

      it('passing IStoreName should create a new form with FormGroup', () => {
        const formGroup = service.createStoreNameFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });
    });

    describe('getStoreName', () => {
      it('should return NewStoreName for default StoreName initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createStoreNameFormGroup(sampleWithNewData);

        const storeName = service.getStoreName(formGroup) as any;

        expect(storeName).toMatchObject(sampleWithNewData);
      });

      it('should return NewStoreName for empty StoreName initial value', () => {
        const formGroup = service.createStoreNameFormGroup();

        const storeName = service.getStoreName(formGroup) as any;

        expect(storeName).toMatchObject({});
      });

      it('should return IStoreName', () => {
        const formGroup = service.createStoreNameFormGroup(sampleWithRequiredData);

        const storeName = service.getStoreName(formGroup) as any;

        expect(storeName).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStoreName should not enable id FormControl', () => {
        const formGroup = service.createStoreNameFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStoreName should disable id FormControl', () => {
        const formGroup = service.createStoreNameFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
