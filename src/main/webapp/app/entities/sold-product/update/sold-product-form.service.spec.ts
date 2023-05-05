import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sold-product.test-samples';

import { SoldProductFormService } from './sold-product-form.service';

describe('SoldProduct Form Service', () => {
  let service: SoldProductFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoldProductFormService);
  });

  describe('Service methods', () => {
    describe('createSoldProductFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSoldProductFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            category: expect.any(Object),
            price: expect.any(Object),
            units: expect.any(Object),
            company: expect.any(Object),
          })
        );
      });

      it('passing ISoldProduct should create a new form with FormGroup', () => {
        const formGroup = service.createSoldProductFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            category: expect.any(Object),
            price: expect.any(Object),
            units: expect.any(Object),
            company: expect.any(Object),
          })
        );
      });
    });

    describe('getSoldProduct', () => {
      it('should return NewSoldProduct for default SoldProduct initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSoldProductFormGroup(sampleWithNewData);

        const soldProduct = service.getSoldProduct(formGroup) as any;

        expect(soldProduct).toMatchObject(sampleWithNewData);
      });

      it('should return NewSoldProduct for empty SoldProduct initial value', () => {
        const formGroup = service.createSoldProductFormGroup();

        const soldProduct = service.getSoldProduct(formGroup) as any;

        expect(soldProduct).toMatchObject({});
      });

      it('should return ISoldProduct', () => {
        const formGroup = service.createSoldProductFormGroup(sampleWithRequiredData);

        const soldProduct = service.getSoldProduct(formGroup) as any;

        expect(soldProduct).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISoldProduct should not enable id FormControl', () => {
        const formGroup = service.createSoldProductFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSoldProduct should disable id FormControl', () => {
        const formGroup = service.createSoldProductFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
